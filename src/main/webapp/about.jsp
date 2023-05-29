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

        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/main.css">
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
                       <li class="active"><a class="label" href="/">Home</a></li>
                       <li><a class="label" href="/contact.jsp">Contact Us</a></li>
                  </ul>
                </div>
            </div>
        </nav>
        
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
        <h2 align="center" class=" heading2">About Us</h2>
    </div>
    
    <div class="container">
        <div class="row">
          <div class="col-sm-10">
              <img align="right" src="img/icon.png" width="280" height="203" alt="icon"/>
            <h3>What is UDiary?</h3>
            <p>UDiary is a project launched by <a href="http://urrsmsng.blogspot.com">urrsm.sng</a> where people can create notes, ideas, daily diaries, etc in an attractive way online. It stores all your diary/notes' data on your google drive and it is safe to use as it converts your notes to secret code to protect the data. It's online text editor(modified nicedit) is very lightweight and interactive. It also supports mini drawing tools with smiley insertions. Therefore, it is a better place to be creative, to store your daily and too keep memories.</p>
            <br>
            <h3>What is <a href="http://urrsmsng.blogspot.com">urrsm.sng</a>?</h3>
            <img src="img/Symboll.png" width="114" height="104" alt="Symboll"/>
            <p><a href="http://urrsmsng.blogspot.com">urrsm.sng</a> is an emerging software developers' company in India.</p>
            <br><br>
            <h3>Message from Aurthor</h3>
			<div style="float: right; border: #000 dashed 1px; box-shadow: 1px 1px 2px; border-radius: 5px;"><img src="img/Piyush.png" width="200" height="178" alt="Piyush" style="border-radius: 5px; "/><div align="center">Piyush Raj Mishra</div></div>
			<nobr>Hi everyone,</nobr><br>
			<p>At first I would like to thank you for visiting our site and using this online diary (if you haven't yet, give it a try you'll love it). I would like to thank my parents, brother who hung lamp for me on my whole journey, friends and colleagues who gave me ideas , my well prayers and everyone who uses UDiary.</p>
                        <p>I would like to specially like to thank <a href="http://nicedit.com/">nicedit</a>'s developers for their such a nice and lightweight html editor, without which this development would not be possible. And <a href="http://www.slax.org">slax</a>'s developer for such a good &AMP; light but complete linux distro, which helped me do all perfectly(without any hangs/freezes while I was running all heavy) in limited space and RAM. At last I'd like to thank all the developers who's javascript/CSS libraries I have used. </p>
                        <p>UDiary is just an idea of storing diaries & notes online to reduce use of paper, make it accessible from and device(phone, PDA, tab, pc). I think using UDiary will reduce the use of paper &AMP; cost of diaries and will change the life style of people. </p>
			<br>
            <h3>Support us by donating</h3>
            <p>We are preparing to improve UDiary. Since google app engine require some amount of money to provide webspace and other features, therefore we need some donations. Please support our work by donating  <img style="resize: none; width: 20px; height: 20px; background-image: url(emoji/e1.png); background-repeat: no-repeat; display:inline-block; background-position: -60px -260px;" draggable="false">.</p>
            <div class="btn" style="background-color: yellow; width:150px; height:40px; border: #000 solid 1px;">Bit Coin</div>
            <div class="btn" style="background-color: white; width:150px; height:40px; border: #000 solid 1px;">PayPal</div>
            <div class="btn" style="background-color: lightskyblue; width:150px; height:40px; border: #000 solid 1px;">Paytm</div>
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
