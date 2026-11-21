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

    /*==========================================================================
      Teachers Modal (Professores - Modal lateral de mesma altura)
    ==========================================================================*/
    const $teacherCards = $('.alpha-teacher-card');

    function closeAllTeacherModals() {
      $('.alpha-teacher-modal.is-open').removeClass('is-open');
      $teacherCards.removeClass('is-active').attr('aria-expanded', 'false');
      $teacherCards.find('.alpha-teacher-action-text').text('Ver detalhes');
    }

    function toggleTeacherModal(cardElem) {
      const $card = $(cardElem);
      const targetId = $card.attr('aria-controls');
      const $targetModal = $('#' + targetId);
      if (!$targetModal.length) return;

      const isOpen = $targetModal.hasClass('is-open');

      // Ao clicar novamente no professor, fecha o modal
      if (isOpen) {
        closeAllTeacherModals();
        return;
      }

      // Fecha outro que possa estar aberto
      closeAllTeacherModals();

      // Abre o modal selecionado ao lado direito do professor, empurrando os outros para o lado
      $targetModal.addClass('is-open');
      $card.addClass('is-active').attr('aria-expanded', 'true');
      $card.find('.alpha-teacher-action-text').text('Fechar');
    }

    // Clique no card do professor
    $teacherCards.on('click', function(e) {
      if ($(e.target).closest('.alpha-teacher-modal').length) return;
      toggleTeacherModal(this);
    });

    // Acessibilidade via teclado (Enter ou Barra de espaço)
    $teacherCards.on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTeacherModal(this);
      }
    });

    // Botão fechar (X) dentro do modal
    $('.alpha-teacher-modal-close').on('click', function(e) {
      e.stopPropagation();
      closeAllTeacherModals();
    });

    // Previne que cliques no corpo do modal fechem o modal
    $('.alpha-teacher-modal').on('click', function(e) {
      e.stopPropagation();
    });

    // Fecha ao clicar fora
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.alpha-teacher-col').length) {
        closeAllTeacherModals();
      }
    });

    // Fecha com a tecla ESC
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAllTeacherModals();
      }
    });

    /*==========================================================================
      Galeria de Fotos - Modal Lightbox Ampliado & Botão Ver Mais
    ==========================================================================*/
    const $galleryModal = $('#galleryModal');
    const $modalImg = $('#galleryModalImg');
    const $modalTitle = $('#galleryModalTitle');
    const $modalDesc = $('#galleryModalDesc');
    const $modalCounter = $('#galleryModalCounter');
    const $galleryToggleBtn = $('#galleryToggleBtn');
    let currentGalleryIndex = 0;

    function openGalleryModal(index) {
      const $visibleItems = $('.alpha-gallery-item:visible');
      if (!$visibleItems.length) return;

      if (index < 0) index = $visibleItems.length - 1;
      if (index >= $visibleItems.length) index = 0;
      currentGalleryIndex = index;

      const $item = $visibleItems.eq(index);
      const src = $item.data('img-src');
      const title = $item.data('img-title') || '';
      const desc = $item.data('img-desc') || '';

      $modalImg.attr('src', src).attr('alt', title);
      $modalTitle.text(title);
      $modalDesc.text(desc);
      $modalCounter.text((index + 1) + ' / ' + $visibleItems.length);

      $galleryModal.addClass('is-open').attr('aria-hidden', 'false');
      $('body').css('overflow', 'hidden');
    }

    function closeGalleryModal() {
      $galleryModal.removeClass('is-open').attr('aria-hidden', 'true');
      $modalImg.attr('src', '');
      $('body').css('overflow', '');
    }

    // Clique na foto para abrir o modal ampliado
    $(document).on('click', '.alpha-gallery-item', function() {
      const $visibleItems = $('.alpha-gallery-item:visible');
      const idx = $visibleItems.index(this);
      openGalleryModal(idx);
    });

    // Acessibilidade via teclado
    $(document).on('keydown', '.alpha-gallery-item', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const $visibleItems = $('.alpha-gallery-item:visible');
        const idx = $visibleItems.index(this);
        openGalleryModal(idx);
      }
    });

    // Fechar no botão X ou clicando no fundo/backdrop
    $('.alpha-gallery-modal-close, .alpha-gallery-backdrop').on('click', function() {
      closeGalleryModal();
    });

    // Navegação anterior e próxima
    $('.alpha-gallery-nav.prev').on('click', function(e) {
      e.stopPropagation();
      openGalleryModal(currentGalleryIndex - 1);
    });

    $('.alpha-gallery-nav.next').on('click', function(e) {
      e.stopPropagation();
      openGalleryModal(currentGalleryIndex + 1);
    });

    // Teclado para a galeria (ESC, Seta Esquerda, Seta Direita)
    $(document).on('keydown', function(e) {
      if (!$galleryModal.hasClass('is-open')) return;
      if (e.key === 'Escape') {
        closeGalleryModal();
      } else if (e.key === 'ArrowLeft') {
        openGalleryModal(currentGalleryIndex - 1);
      } else if (e.key === 'ArrowRight') {
        openGalleryModal(currentGalleryIndex + 1);
      }
    });

    // Botão "Ver mais fotos" para desbloquear o restante das imagens
    if ($galleryToggleBtn.length) {
      $galleryToggleBtn.on('click', function() {
        const isExpanded = $(this).hasClass('is-expanded');

        if (!isExpanded) {
          // Desbloqueia as fotos restantes
          $('.alpha-gallery-item-col.is-hidden')
            .removeClass('is-hidden')
            .addClass('is-revealed');
          $(this).addClass('is-expanded').attr('aria-expanded', 'true');
          $(this).find('.btn-text').text('Ver menos fotos');
        } else {
          // Oculta novamente mantendo apenas as 4 primeiras
          $('.alpha-gallery-item-col').slice(4).addClass('is-hidden').removeClass('is-revealed');
          $(this).removeClass('is-expanded').attr('aria-expanded', 'false');
          $(this).find('.btn-text').text('Ver mais fotos');
          // Rola suavemente de volta para o topo da galeria
          $('html, body').animate({
            scrollTop: $('#galeria').offset().top - 80
          }, 350);
        }
      });
    }

});