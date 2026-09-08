$(document).ready(function(){
  
  // ===== Mobile-Menu =====>

  $(".mobile-menu .menu-toggle").click(function () {
    $(".menu-content").slideToggle();
  });

  $(".mobile-menu .fa-chevron-down").click(function () {
    $(".mobail-submenu").slideToggle();
  });

  /*================
   Search Popup
  ==================*/

  if($('.search-icon').length) {
    $('.search-icon').on('click', function() {
      $('body').addClass('search-active');
    });
    $('.search-close').on('click', function() {
      $('body').removeClass('search-active');
    });
  }

  // ===== Venobox =====>

  $(".venobox").venobox();

  // ===== Accordion =====>

  $(".accordion-header").first().addClass("active");
  $(".accordion-content").first().slideDown();
  $(".accordion-header").click(function() {
    $(this).toggleClass("active").next(".accordion-content").slideToggle();

    $(".accordion-content").not($(this).next()).slideUp();
    $(".accordion-header").not($(this)).removeClass("active");
  });

  // ===== Carousel =====>
  
  $(".hero-carousel").owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      dots: true,
      nav: true,
  });

  $(".testimonial-carousel").owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
  });

  $(".brand-carousel").owlCarousel({
      items: 6,
      margin: 160,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      dots: false,
      responsive:{
        0:{
          items:1,
        },
        768:{
          items:3,
          margin: 100,
        },
        992:{
          items:4,
          margin: 80,
        },
        1200:{
          items:6,
        }
      }
  });

    /*===========
     Button
    =============*/

    $('.button').on('mouseenter', function(e){
        x = e.pageX - $(this).offset().left;
        y = e.pageY - $(this).offset().top;
        $(this).find('span').css({top:y, left: x})
    })
    $('.button').on('mouseout', function(e){
        x = e.pageX - $(this).offset().left;
        y = e.pageY - $(this).offset().top;
        $(this).find('span').css({top:y, left: x})
    })

});