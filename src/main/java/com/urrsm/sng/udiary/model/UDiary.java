package com.urrsm.sng.udiary.model;

import com.google.gson.Gson;
import java.util.ArrayList;

/**
 *
 * @author root
 */
public class UDiary
{
    public UDiary()
    {
        
    }
    
    public String createJson()
    {
        return(new Gson().toJson(this));
    }
}
