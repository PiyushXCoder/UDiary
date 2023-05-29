<%-- Now, this is netbean's enemy. --%>

<%@ page import="com.google.api.client.http.javanet.NetHttpTransport"%>
<%@ page import="com.google.api.client.json.jackson2.JacksonFactory"%>
<%@ page import="com.google.api.client.auth.oauth2.Credential" %>
<%@ page import="com.google.api.services.oauth2.model.Userinfoplus" %>
<%@ page import="com.urrsm.sng.udiary.ServletToolkit" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <!-- Start:HeaderDeclarations -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>UDiary</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <link rel="shortcut icon" href="favicon.ico">
        <link rel="stylesheet" href="css/bootstrap.min.css" media="none" onload="if(media!='all')media='all'">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css" media="none" onload="if(media!='all')media='all'">
        <link rel="stylesheet" href="css/main.css" media="none" onload="if(media!='all')media='all'">
        <style>
            body {
                padding-top: 50px;
                padding-bottom: 20px;
            }
        </style>
        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
        <!-- End:HeaderDeclarations -->
    </head>
    <body style=" background-image: url('img/1627.jpg');">
        <%
            Userinfoplus userinfo = ServletToolkit.getUserInfo(request, response);
            if(userinfo==null)return;
            pageContext.setAttribute("userinfo",userinfo);
        %>
        <!-- Start:1st Navigation Bar(Title Bar) -->
        <nav class=" navbar navbar-fixed-top deft-navbar">
            <div class=" container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"><img src="img/menu.png"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                    </button>
                    <span>
                        <a class=" navbar-brand" href="#"><nobr><img width="40px" height="29px" src="img/icon.png">UDiary</nobr></a>
                        <sup><i class="coats ">Storing Great Ideas!</i></sup>
                    </span>
                </div>
                <div id="navbar" class="navbar-collapse collapse navbar-right">
                   <ul class="nav navbar-nav">
                       <li class="active"><a class="label" href="/">Home</a></li>
                       <li><a class="label" href="/contact.jsp">Contact Us</a></li>
                    <li><a class="label" href="/about.jsp">About Us</a></li>
                  </ul>
                </div>
            </div>
        </nav>
        <!-- End:Navigation Bar -->
        
        <!-- Start:Action Bar -->
        <div class="actionbar">
            <button type="button" style="float: left; border: none; background: transparent; padding-top:5px;" onclick="sideNavbarAction();">
                <span class="icon-bar"><img src="img/menu.png" width="30" height="30" alt="menu"/></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <div style="padding-top: 5px;">
                <div class="btn" title="Add Diary" data-toggle="modal" data-target="#addDiaryModal" style="float: left; display: block; width: 30px; height: 30px; background-image: url(img/dboard.png); "></div>
                <div class="btn" title="Delete Diary" data-toggle="modal" data-target="#" style="float: left; display: block; width: 30px; height: 30px; background-image: url(img/dboard.png); background-position: 30px;"></div>
            </div>
        </div>
        <!-- End:Action Bar -->
        
        <!-- Start:Side NavigationBar -->
        <div id="sidenavbar" class="sidenav">
            <form style=" width: 100%; height: 100%;">
                <div class="sideNavCover">
                    <img src="${userinfo.picture}" class="displayPic" /><br>
                    <strong id="sidenavbarName" style="padding-left: 10px; font-family: comic sans ms; font-size: 12px; color: white; outline: #000 1px; ">${userinfo.name}</strong><br>
                    <p id="sidenavbarEmail" style="padding-left: 10px; font-family: comic sans ms; font-size: 12px; color: white; ">${userinfo.email}</p>
                </div>
                <div class="sideNavMenu">
                    <a href="/"><div>Shelf</div></a>
                    <a href="/logout"><div>Log Out</div></a>                
                </div>
            </form>
        </div>
        <!-- End:Side Navigation Bar -->
        <!-- Start:Working area-->
        <div style="padding-top: 50px;" class="container">
            <div class=" col-md-12 thumbnail">
                <div class="diary-thumbnail thumbnail" style=" float: left;"></div>
                <div style="width: calc(100% - 150px)">
                    <h3>Title</h3>
                    <article>description...........</article>
                </div>
                <input class="btn btn-success" value="Open">
            </div>
        </div>
        
        <!-- Add Diary -->
        <div class="modal fade" id="addDiaryModal" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Add Diary</h4>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs">
                            <li class="active"><a data-toggle="tab" href="#addtheme">Theme</a></li>
                            <li><a data-toggle="tab" href="#adddetails">Details</a></li>
                        </ul>
                        <div class="tab-content">
                            <div id="addtheme" class="tab-pane fade in active">
                                
                            </div>
                            <div id="adddetails" class="tab-pane fade">
                                <div class=" form-group" style=" margin-top: 20px;">
                                    <label>Name:</label>
                                    <input class=" form-control">
                                </div>
                                <div class=" form-group">
                                    <label>Note:</label>
                                    <textarea class=" form-control"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Create</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- End:Working Canvas -->
        <!-- Start: ihtml editor script -->
        <!-- End: ihtml editor script-->
        <!-- Start:container -->
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.js"><\/script>');</script>

        <script src="js/vendor/bootstrap.min.js"></script>

        <script src="js/main.js"></script>
        
        <script src="js/cupboard.js"></script>
        
        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments);});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r);}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X','auto');ga('send','pageview');
        </script>
        <!-- End:container -->
        <link rel="stylesheet" href="css/fonts.css">
</body>
</html>
