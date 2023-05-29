<%-- Now, this is netbean's enemy. --%>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>UDiary</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <link rel="shortcut icon" href="favicon.ico">
        <!-- Stylesheet Start -->
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/main.css">
        <style>
            body {
                padding-top: 50px;
                padding-bottom: 20px;
            }
            
        </style>
        <!-- Stylesheet End -->

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
                       <li class="active"><a class="label" href="/">Home</a></li>
                    <li><a class="label" href="/about.jsp">About Us</a></li>
                  </ul>
                </div>
            </div>
        </nav>
        
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
        <h2 align="center" class=" heading2">Contact Us</h2>
    </div>
    
    <div class="container">
        <div class="row">
          <div class="col-sm-10">
              <h3>Feedback:</h3>
              <form>
              <h4 style="float: left; padding-right: 40px; " data-toggle="tooltip" title="Required">Name <sup style="color:red">*</sup></h4>
              <input style="width: 300px;" class="form-control" data-toggle="tooltip" title="Required" required><br>
              <h4 style="float: left; padding-right: 44px; " data-toggle="tooltip" title="Required">Email <sup style="color:red">*</sup></h4>
              <input type="email" style="width: 300px;" class="form-control" data-toggle="tooltip" title="Required" required><br>
              <h4 style="float: left; padding-right: 24px; ">Feedback</h4>
              <textarea style="width: 500px; height: 300px;" class="form-control"></textarea><br>
              <input type="submit" class="btn btn-success" value="Submit"><br>
              </form>
              <hr>
              <h3>Contacts:</h3>
              <span><b>email : </b><i><a href="mailto:piyush.raj.kit@gmail.com?Subject=Feedback" target="_top">piyush.raj.kit@gmail.com</a></i></span><br>
              <span><b>site : </b><i><a href="http://urrsmsng.blogspot.com">urrsmsng.blogspot.com</a></i></span><br>
              <span><b>facebook : </b><i><a href="https://facebook.com/urrsm.sng/">facebook.com/urrsm.sng</a></i></span>
              
          </div>
        </div>
      </div>
        
      <hr>
      <footer>
          <center>
              <p style=" width: 300px; border: #f0ad4e thin dashed;">Created by <a href="http://urrsmsng.blogspot.com/">urrsm.sng</a></p>
          </center>
      </footer>
     <!-- /container -->        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.js"><\/script>')</script>

        <script src="js/vendor/bootstrap.min.js"></script>

        <script src="js/main.js"></script>

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
