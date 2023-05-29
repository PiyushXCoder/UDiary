package com.urrsm.sng.udiary;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.oauth2.Oauth2;
import com.google.api.services.oauth2.model.Userinfoplus;
import com.urrsm.sng.udiary.CredentialMediator.InvalidClientSecretsException;
import com.urrsm.sng.udiary.CredentialMediator.NoRefreshTokenException;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author root
 */
public class SkeletonServlet extends HttpServlet
{
    
    private final Collection<String> SCOPE = Arrays.asList(
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile");//DriveScopes.DRIVE);
    private final String CLIENT_SECRETS_FILE_PATH = "/WEB-INF/classes/client_id.json";
    private static final HttpTransport TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = new JacksonFactory();
    
    @Override
    public void init() throws ServletException
    {    
    }
    
    protected void sendError(HttpServletResponse resp, int code, String message)
    {
        try {
          resp.sendError(code, message);
        } catch (IOException e) {
          throw new RuntimeException(message);
        }
    }
    
    private CredentialMediator getCredentialMediator(HttpServletRequest request, HttpServletResponse response, String redirectURL)
    {
        CredentialMediator credentialMediator = null;
        try 
        {
            credentialMediator = new CredentialMediator(request, request.getSession().getServletContext().getResourceAsStream(CLIENT_SECRETS_FILE_PATH), SCOPE);
            credentialMediator.getActiveCredential();
        } 
        catch (NoRefreshTokenException ex)
        {
            try
            {
                if(redirectURL==null)response.sendRedirect(response.encodeURL(ex.getAuthorizationUrl()));
                else response.sendRedirect(redirectURL);
                return null;
            }
            catch(IOException ioe)
            {
                ioe.printStackTrace();
                sendError(response,500,"Failed to redirect for authorization.");
                throw new RuntimeException("Failed to redirect for authorization.");
            }
            finally
            {
                credentialMediator = null;
            }
        }
        catch (InvalidClientSecretsException ex) 
        {
            String message = String.format("This application is not properly configured: %s", ex.getMessage());
            sendError(response, 500, message);
            throw new RuntimeException(message);
        }
        catch (IOException ex)
        {
            String message = String.format("Error while loading the Credentials: %s", ex.getMessage());
            sendError(response, 500, message);
            credentialMediator = null;
            throw new RuntimeException(message);
        }
        return credentialMediator;
    }
    
    /**
     *
     * @param request
     * @param response
     * @return
     */
    protected Credential getCredential(HttpServletRequest request, HttpServletResponse response)
    {
        CredentialMediator mediator = getCredentialMediator(request, response,null);
        if(mediator != null)
        {
            try
            {
                return mediator.getActiveCredential();
            }
            catch (NoRefreshTokenException ex)
            {
                try
                {
                    response.sendRedirect(response.encodeURL(ex.getAuthorizationUrl()));
                }
                catch(IOException ioe)
                {
                    ioe.printStackTrace();
                    throw new RuntimeException("Failed to redirect for authorization.");
                }
            }
            catch(IOException ioe)
            {
                String message = String.format("Error while loading the Credentials: %s", ioe.getMessage());
                sendError(response, 500, message);
                throw new RuntimeException(message);
            }
        }
        return null;
    }
    
    /**
     *
     * @param request
     * @param response
     * @return
     */
    protected Oauth2 getOauth2Service(HttpServletRequest request, HttpServletResponse response)
    {
        Credential credential = getCredential(request, response);
        if(credential!=null)return new Oauth2.Builder(TRANSPORT, JSON_FACTORY, credential).build();
        return null;
    }
    
    /**
     *
     * @param request
     * @param response
     * @return
     */
    protected Drive getDriveService(HttpServletRequest request, HttpServletResponse response)
    {
        Credential credential = getCredential(request, response);
        if(credential!=null)return new Drive.Builder(TRANSPORT, JSON_FACTORY, getCredential(request, response)).build();
        return null;
    }
    
    /**
     *
     * @param request
     * @param response
     * @return
     */
    protected Userinfoplus getUserInfo(HttpServletRequest request, HttpServletResponse response)
    {
        Userinfoplus userInfo = null;
        Oauth2 userInfoService = getOauth2Service(request,response);
        if(userInfoService==null)return null;
        try
        {
            userInfo = userInfoService.userinfo().get().execute();
            if(userInfo == null)
            {
                throw new RuntimeException("UserInfo is Null");
            }
        }
        catch(IOException e)
        {
            e.printStackTrace();
        }
        return userInfo;
    }
    
    /**
     *
     * @param request
     * @param response
     * @param redirectURL
     * @return
     */
    protected String getClientId(HttpServletRequest request, HttpServletResponse response, String redirectURL)
    {
        CredentialMediator cm = getCredentialMediator(request ,response,redirectURL);
        if(cm != null)return cm.getClientSecrets().getWeb().getClientId();
        return null;
    }
}
