<%-- Now, this is netbean's enemy. --%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> 
<html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>UDiary</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <link rel="shortcut icon" href="favicon.ico">      
        
        <!-- StyleSheets Start -->
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/main.css">
        <!-- Styesheets End    -->
        <style>
            body {
                padding-top: 50px;
                padding-bottom: 20px;
            }
            
        </style>
        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
    </head>
    <body>
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
                       <li class="active"><a class="label" href="/start">Home</a></li>
                       <li><a class="label" href="/contact.jsp">Contact Us</a></li>
                    <li><a class="label" href="/about.jsp">About Us</a></li>
                    <li><a id ="account" class="label" href="/?sign">Sign In</a></li>
                  </ul>
                </div>
            </div>
        </nav>
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron jumboHome">
        <img src="img/icon.png" class="img-rounded" align="right">
        <div class="container">
            <h1 style="text-shadow: #444 0 1px 1px;  color: #009999;">UDiary</h1>
        <p>What an Idea sir!!!. <br>
           Are you roaming in market, on street or sitting in garden? And suddenly an idea hits your mind? Where to write it? Udiary is the best place to write your ideas. </p>
        <p><a style="background: #66ae29" class="btn btn-primary btn-lg" href="/about.jsp" role="button">Know More &raquo;</a>
            <a style="background: #28a4c9" class="btn btn-primary btn-lg" href="/?sign" role="button">Sign In &raquo;</a>
        </p>
      </div>
    </div>
    
    <div class="container">
        <div class="row">
            <div class="col-sm-4">
            <h3 class="heading2">Fast & Easy</h3>
            <p>It is fast & easy with format editor to store ideas decoratively.</p>
          </div>
          <div class="col-sm-4">
            <h3 class="heading2">No fear of data loss!</h3>
            <p>When you save all your data on cloud, it prevents the chance of data loss by any damage to you PDA!</p>
          </div>
          <div class="col-sm-4">
            <h3 class="heading2">Safe</h3>
            <p>All the notes are saved on your drive in the form of secret codes which prevents third party to steal your ideas.</p>
          </div>
          <div class="col-sm-4">
            <h3 class="heading2">Paint tools</h3>
            <p>You can draw images in your diary with paint tools.</p>
          </div>
        </div>
      </div>
        
      <hr>
      <footer>
          <center>
              <p style=" width: 300px; border: #f0ad4e thin dashed;">Created by <a href="http://urrsmsng.blogspot.com/">urrsm.sng</a></p>
          </center>
      </footer>
    
    <!-- /container -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.js"><\/script>')</script>
    <script src="js/vendor/bootstrap.min.js"></script>
    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
    <script>
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        ga('create','UA-XXXXX-X','auto');ga('send','pageview');
    </script>
    </body>
</html>
