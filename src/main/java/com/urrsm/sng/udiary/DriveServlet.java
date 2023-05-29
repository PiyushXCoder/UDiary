package com.urrsm.sng.udiary;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.urrsm.sng.udiary.model.UDiary;
import com.urrsm.sng.util.ResumableUpload;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.util.Collections;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author root
 */
public class DriveServlet extends HttpServlet
{
    private final String HOME_FOLDER = "UDiary";
    public File homeDir;
    public File confFile;
    /**
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String reqparam = null;
        InputStream stream = request.getInputStream();
        Scanner s = new Scanner(stream, "UTF-8").useDelimiter("\\A");            
        reqparam = s.hasNext() ? s.next() : "";
        
        response.setContentType("application/json");
        
        PrintWriter out = response.getWriter();
        Drive drive = ServletToolkit.getDriveService(request, response);
        if(drive==null)return;
        homeDir = getHomeDir(request, response, drive);
        
        JsonReader read = Json.createReader(new StringReader(reqparam));
        
        JsonObject reqjson = read.readObject();
        
        String cmd = reqjson.getString("cmd");
        
        if(cmd.contains("listdiaries"))
        {
            JsonArrayBuilder jsonab = Json.createArrayBuilder();
        
            FileList filelist = ListDiaries(drive);
            
            out.println("{'diaries':['Diary']}");
        }
        
        
        
    }

    private File getHomeDir(HttpServletRequest request, HttpServletResponse response, Drive drive)throws IOException
    {
        FileList files = drive.files().list()
                                   .setQ("name = '"+HOME_FOLDER+"' and mimeType = 'application/vnd.google-apps.folder' and 'root' in parents")
                                   .execute();
        if(files.getFiles().isEmpty())return createHome(request, response, drive);
        for(File file:files.getFiles())
        {
                System.out.println("[DRIVE:LIST] Listsing home dir:\n"+file.getName()+"\t"+file.getId());
                FileList childs = drive.files().list()
                                   .setQ("name = 'udiary-main.json' and '"+file.getId()+"' in parents") 
                                   .execute();
                if(childs.getFiles().isEmpty())return createHome(request, response, drive);
                confFile = childs.getFiles().get(0);
                return file;
        }
        return null;
    }
    
    private File createHome(HttpServletRequest request, HttpServletResponse response, Drive drive)throws IOException
    {
        String id = drive.files().get("root").setFields("id").execute().getId();
        File homedata = new File(); 
        homedata.setName(HOME_FOLDER);
        homedata.setParents(Collections.singletonList(id));
        homedata.setMimeType("application/vnd.google-apps.folder");
        File home = drive.files().create(homedata).setFields("id").execute();
        
        String udiaryjsonbody = new UDiary().createJson();
        File udiaryjson = new File();
        udiaryjson.setName("udiary-main.json");
        udiaryjson.setSize((long)udiaryjsonbody.length());
        udiaryjson.setMimeType("text/json");
        udiaryjson.setParents(Collections.singletonList(home.getId()));
        
        ResumableUpload rsm = new ResumableUpload();
        Credential credential = ServletToolkit.getCredential(request, response);
        String conf[] = rsm.requestUploadUrl(request, response, drive, credential, udiaryjson);
        
        if(conf[0] != null)
        {
            try {
                rsm.uploadString(request, response, conf[0], credential, udiaryjson, udiaryjsonbody);
                this.confFile = drive.files().get(conf[1]).execute();
            } catch (ResumableUpload.UploadFileException ex) {
                Logger.getLogger(DriveServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
        System.out.println("[DRIVE:CREATED] "+home.getName()+"\t"+home.getId());
        
        return home;
    }
    
    // List diaries
    private FileList ListDiaries(Drive drive) throws IOException
    {
        FileList filelist = drive.files().list().setQ("'"+homeDir.getId()+"' in parents and mimeType = 'application/vnd.google-apps.folder'").execute();
        
        return filelist;
    }
    
    // Diary Config
    private JsonObject getConfig(Drive drive, File diary) throws IOException
    {
        FileList files = drive.files().list().setQ("name = 'config.cfg' and '"+diary.getId()+"' in parents").execute();
        
        if(!files.getFiles().isEmpty())
        {
            File diaryconf = files.getFiles().get(0);
            
            InputStream in = drive.files().export(diaryconf.getId(), diaryconf.getMimeType()).executeMediaAsInputStream();
            
            Scanner s = new Scanner(in);
            StringBuilder sb = new StringBuilder();
            while(s.hasNext())
            {
                sb.append(s.nextLine());
            }
            System.out.println(sb.toString());
            //return read.readObject();
        }
        return null;
    }
    
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
