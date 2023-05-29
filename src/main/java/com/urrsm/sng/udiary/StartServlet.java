package com.urrsm.sng.udiary;


import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author root
 */
public class StartServlet extends SkeletonServlet
{
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException 
    {
        //Overriding JSSESIONID and changing cookie expire time to 10days.
        Cookie cookie = new Cookie("JSESSIONID", request.getSession().getId());
        cookie.setMaxAge(0xd2f00);
        response.addCookie(cookie);
        //Check if the request is for sign in
        String reqStr = request.getParameter("sign");
        String clientID = null;
        if(reqStr!=null)
            clientID = this.getClientId(request, response, null);//then go for signin
        else
            clientID = this.getClientId(request, response, "/index.jsp");//else go to index.jsp
        if(clientID==null) return;//If clientID is null, it means no credentials. So, redirect to OAuth or index.jsp without further executing.
        //Now, if you have correct credentials(i.e you had signin successfully so you need to go to shelf.jsp
        //So, Set the attributes of the session here.
        
        //[START Attributes]
        request.setAttribute("clientID", clientID);
        //[END Attributes]
        
        //Now, redirecting user to shelf.jsp preserving the attributes of session
        request.getRequestDispatcher("/shelf.jsp").forward(request, response);        
    }
    
    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "This Servlet decides and redirects the client to the start page.";
    }
}
