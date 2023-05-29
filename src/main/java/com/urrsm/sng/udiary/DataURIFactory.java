package com.urrsm.sng.udiary;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.util.ByteArrayBuffer;

/**
 *
 * @author root
 */
public class DataURIFactory
{
    private final int SIZE_LIMIT = 0xe1000;
    
    public String convertToDataURL(URL url) throws ConnectionFailedException,UnAcceptableFileTypeException,UnAcceptableFileSizeException,IOException
    {
        //Open The connection to the URL provided.
        URLConnection conn = null;
        try
        {
            conn = url.openConnection();
        }
        catch(IOException ioe)
        {
            throw new ConnectionFailedException("There was problem while opening connection to the URL.");
        }
        //Solving Appengine problems with URLConnection
        conn.setReadTimeout(60000);//I don't what value to set yet.
        conn.setConnectTimeout(60000);
        //Filter the content type to 'image' only.
        String contType = conn.getContentType();
        if(!contType.startsWith("image")) throw new UnAcceptableFileTypeException("URL:"+url+";\nContent-Type:"+contType+";\nThe requested URL is not of an Image file.");
        //Filter the file size length.
        int length = conn.getContentLength();
        if( length==-1 || length > SIZE_LIMIT) throw new UnAcceptableFileSizeException("URL:"+url+";\nContent-Type:"+contType+";\nContent-Size"+length+"bytes;\nDue to limitations with the server, only file of "+SIZE_LIMIT+"bytes and less are allowed.");
        //Start downloading the file in a buffer(in RAM).
        BufferedInputStream bis = new BufferedInputStream(conn.getInputStream());
        ByteArrayBuffer baf = new ByteArrayBuffer(500);//Taking initial buffer capacity as 500 bytes.
        int data = -1;//initial data as -1 not as 0 because while reading data(bytes) from a stream -1 means empty or no more data.
        while((data = bis.read()) != -1) baf.append((byte)data);
        String encoded = Base64.encodeBase64String(baf.toByteArray());
        baf = null;//Now making baf=null, a trick to clear it's allocations in RAM.
        return "data:"+contType+";base64,"+encoded;
    }
    
    public class ConnectionFailedException extends Exception
    {
        public ConnectionFailedException(String msg)
        {
            super(msg);
        }
    }
    public class UnAcceptableFileTypeException extends Exception
    {
        public UnAcceptableFileTypeException(String msg)
        {
            super(msg);
        }
    }
    public class UnAcceptableFileSizeException extends Exception
    {
        public UnAcceptableFileSizeException(String msg)
        {
            super(msg);
        }
    }
    
}
