package com.urrsm.sng.udiary;


import com.urrsm.sng.udiary.DataURIFactory.ConnectionFailedException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author root
 */
public class DataURLServlet extends HttpServlet
{
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String url = request.getParameterValues("url")[0];
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        try
        {
            String dataurl = new DataURIFactory().convertToDataURL(new URL(url));
            out.println(dataurl);
            dataurl=null;//trick to clear RAM.
        }
        catch(ConnectionFailedException | DataURIFactory.UnAcceptableFileSizeException | DataURIFactory.UnAcceptableFileTypeException | IOException ex)
        {
            response.sendError(500, ex+"\n"+ex.getMessage());
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
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
     * Handles the HTTP <code>POST</code> method.
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
        return "This servlet downloads and converts images to their DataURI\n"
                + "which can be further utilised by any other web app or client side scripts\n"
                + "such as JavaScript which faces many troubles for getting datauris of images of out domains.\n"
                + "Usage: Ask me a request (GET/POST) through\n"
                + "\thttp://udatauri.appspot.com/getdatauri?url=<URL of any image here.>\n"
                + "The URL should not be from a local domain(ex: localhost,192...,...) the URL.\n"
                + "The URL should be accessible from anywhere.\n"
                + "Don't forget to follow all rules of assigning values to parameters in a URL.(Ex: %26 for '&',%20 for ' ',...\n"
                + "There is a limit to the file size of the images (i.e 900KB) because of limitations\n"
                + "of appengine resources for free qota.";
    }// </editor-fold>
}
