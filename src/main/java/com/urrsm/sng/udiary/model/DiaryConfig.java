package com.urrsm.sng.udiary.model;

import com.google.gson.Gson;
import java.util.ArrayList;

/**
 *
 * @author root
 */
public class DiaryConfig
{
    private String name;
    private String date;
    private String datePublicKey;
    private String dateSignature;
    private String comment;
    private String theme;
    private ArrayList<String> pages;
    
    public DiaryConfig(String name, String date, String datePublicKey, String dateSignature, String comment, String theme, ArrayList<String> pages)
    {
        this.name = name;
        this.date = date;
        this.datePublicKey = datePublicKey;
        this.dateSignature = dateSignature;
        this.comment = comment;
        this.theme = theme; 
        this.pages = pages;
    }
        
    public String getName()
    {
        return this.name;
    }
    
    public String getDate()
    {
        return this.date;
    }
    
    public String getDatePublicKey()
    {
        return this.datePublicKey;
    }
    
    public String getDateSignature()
    {
        return this.dateSignature;
    }
    
    public String getComment()
    {
        return this.comment;
    }
    
    public String getTheme()
    {
        return this.theme;
    }
    
    public ArrayList<String> getpages()
    {
        return this.pages;
    }
    
    public void setName(String name)
    {
        this.name = name;
    }
    
    public void setDate(String date)
    {
        this.date = date;
    }
    
    public void setDatePublicKey(String datePublicKey)
    {
        this.datePublicKey = datePublicKey;
    }
    
    public void setDateSignature(String dateSignature)
    {
        this.dateSignature = dateSignature;
    }
    
    public void setComment(String comment)
    {
        this.comment = comment;
    }
    
    public void setTheme(String theme)
    {
        this.theme = theme;
    }
    
    public void setpages(ArrayList<String> pages)
    {
        this.pages = pages;
    }
    
    public String createJson()
    {
        return(new Gson().toJson(this));
    }
}
