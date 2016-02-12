(function($){
    
    
    $.fn.jCatResp = function(options){
        
        var defaults        = {
            'itempage'      : 5, 
            'itemActive'    : 1,
            'margin'        : 10,
            'btnavancar'    : 'apagegast',
            'btnvoltar'     : 'vpagegast'
        };        
        
        
        var settings            = $.extend( {}, defaults, options ); 
        
        var categSelct          = '';
        var imgThumbs           = new Array();
        var imgShow             = new Array();
        
        var WindowWidth         = 0;
        var ApressWidth         = 0;
        var tamanhoImagem       = 0;
        var totalImagens        = 0;
        var widthTodasImagens   = 0;
        var posicaoBloco        = 0;
        var ImageActive         = '';
        var cNext               = 0;
        var cPrev               = 0;
        
        var nameCateg           = '';
        var h2Colecao           = '';
        
        var showImage = function(srcImg,srcImgShow){
            
            var NewImg = new Image();
            
            $('#imgShow img').remove(); 
            
            $(NewImg).hide().load(function(){
                
                $('#imgShow').append(NewImg);
                
                $(NewImg).fadeIn();
                
                $('#quadrado .fd-branco').fadeOut();
                
            }).attr('src',srcImg).attr('data-ishow',srcImgShow);            
            
            var tmhImgShow = Math.ceil(($(window).width())* 0.26274);
            
            if(  $('#cont-show').length ){
                
                 $('#cont-show').height(tmhImgShow).width(tmhImgShow);
                 
                 $('#quadrado').height(tmhImgShow).width(tmhImgShow);
                 
                 $('#cont-show').css({
                     'margin-left'  : '-'+(tmhImgShow/2)+'px',
                     'margin-top'   : '-'+ ( ( tmhImgShow/2) + 5 ) +'px'  
                 });
            }
            
            
        };
        
        
        var catalogo = function(){
            
            var element = $("#apress li");
            
            // se existir a estrutura realiza os eventos
            if( element.length){                
                
                WindowWidth     = $(window).width(); // pega o tamanho da tela    
                ApressWidth     = $("#apress").width(); // pega onde fica o catalogo
                tamanhoImagem         =  parseFloat(((ApressWidth/settings.itempage))); // calcula o tamanho de cada imagem/li
                totalImagens         = 0; // total de imagem
                     
                
                // conta quantos li existem
                element.each(function(i){totalImagens = (i + 1);});
               
                widthTodasImagens   = parseFloat(((totalImagens*tamanhoImagem))); // tamanho com todas as imagems
                var inicioBloco2    = parseFloat(widthTodasImagens/2);
                var imgCentro       = Math.ceil(settings.itempage/2);
                posicaoBloco    = parseFloat( inicioBloco2 - ( (imgCentro*tamanhoImagem) - tamanhoImagem ) ) ;
               
                // tamanho do container (li) com as imagens
                element.css({'width' : tamanhoImagem+'px'});
                
                // tamanho da div principal
                $(".cnt-img").css({ 'width' : ApressWidth+'px' });
               
                // tamanho com todas as imagems/li
                $(".cnt-img ul").css({ 'width' : widthTodasImagens+'px' });
                
                $(".cnt-img ul").css({'left' : '-'+posicaoBloco+'px'});
                
                $(".cnt-img ul li").removeClass('active');
                
                $(".cnt-img ul li").eq( Math.ceil(totalImagens/2) ).addClass('active');
                
                
                ImageActive     = $(".cnt-img ul .active").data('imgcenter');  
                var iShow       = $(".cnt-img ul .active").data('img');
                showImage(ImageActive,iShow);
                
                // pega a altura imagem thumbs e adiciona a altura no UL
                var myImg = document.querySelector(".cnt-img ul li img");
                var currHeight = myImg.clientHeight;
                $(".cnt-img ul").height(currHeight);
                
                $("#catalogo .cnt-img ul").css({
                    'margin-top' : '-' + (currHeight/2) + 'px'
                });
                
                
            }
        };
        
        $('.cd-catg',this).click(function(){
            
            // pega a categoria quando clicado
            var idCateg = $(this).data('cid');
            
           $("#catalogo").addClass('loadcolec');
            
            // pega o nome da colecao
            nameCateg = $(this).data('categname');
            
            h2Colecao = $("#colecao h2").html();
            
            //$("#colecao h2").html('<span class="txt1">'+h2Colecao+'</span> '+'<span class="txt2">// '+ nameCateg+'</span>' );
            
            // percorre todas a lista e pega a thumbs 
            // e as imagens grandes
            $("#cid-"+idCateg+' li').each(function(i){
               imgThumbs[i] = $('img',this).attr('src');
               imgShow[i]   = $(this).data('img');
            });
                        
            
            // abre a tela de load -> tela preta com carregamento
            $('body').append('<div id="catalogload"></div>');
            
            // caminha imagem de fundo / load
            var urlImgBgLoading = location.href+'js/img/load.gif';            
            
            $("#catalogload").css({
                'display'               : 'block',
                'position'              : 'fixed',
                'left'                  : '0px',
                'top'                   : '0px',
                'z-index'               : '999999999',
                'background-image'      : 'url('+urlImgBgLoading+')',
                'background-repeat'     : 'no-repeat',
                'background-position'   : 'center center',
                'background-color'      : '#000000',
                'height'                : '100%',
                'width'                 : '100%'
            });
            
            // pega a lista da categoria selecionada
            categSelct =  $("#cid-"+idCateg).html();
            
            //var urlImgFd = location.href+'js/img/fd-center-img.png';
            
            // inseri a lista mas mantem oculta
            $(this).parent().prepend('<div style="display:none;" id="apress"><div class="cnt-img">'+categSelct+'<div id="cont-show"><div id="imgShow"><div class="lupa"></div></div></div></div><div class="bnts-l"></div><div class="bnts-r"></div></div>');            
            
            
            $("#cont-show").prepend(function(){
                return $('<div id="quadrado"><div class="fd-branco"></div></div>').click( ShowImg );
            });
            
            $('#apress').append(function(){return $('<div class="fechartela">X</div>').click( fecharTela); });
                        
                        
            // cria o div do botao fechar
            $('.bnts-l').append(function(){return $('<button id="prev"></button>').click( prevClick); });
            $('.bnts-r').append(function(){return $('<button id="next"></button>').click( nextClick); });
            
            // clona os elementos para duplicar
            var categItems = $('#apress .cnt-img ul'),
                items   = categItems.find('li'),            
                first   = items.filter(':first');
            first.before(items.clone(true));   
            //first.after(items.clone(true));
			
			
            // mostra a
            $("#apress").fadeIn(function(){
                
                // oculta a lista de categoria
                $(".cd-catg").fadeOut();
                
                // remove o load
                $("#catalogload").fadeOut(function(){$(this).remove();});                
                
            });            
            
            $(".avscolec").css({'display' : 'none'});
            catalogo();
        });
        
        catalogo();
        //chama a funcao onResize todas as vezes que a tela for redimensionada
        $(window).resize(function(){
            catalogo();
            if( $("#cd-img").length ){
                $("#localimg").remove();
                $("#cd-img").remove();
            }
        });
        
        
        var SImg = function(sImg){
            
            var NImg = new Image();
            
            $('#localimg').remove(); 
            
            $("body").css({
                'overflow': 'hidden'
            });
            
             $("#top-header").fadeOut();
            
            $('body').append('<div id="loadimgshow"></div>')
                    .append('<div id="localimg"></div><div id="cd-img"><div id="cdimg"></div></div>');
                  
                  $("#cd-img img").append('<div></div>');
                  
            $('#cdimg').append(function(){return $('<div id="fecharimg">X</div>').click( fecharImg); });
           //<div id="fecharimg">X</div>
            
            $(NImg).hide().load(function(){
                
                $('#cdimg').append(NImg);
                
                $(NImg).fadeIn();
                
                $('#loadimgshow').remove();
                
                $("#cd-img").height($(window).height())
                        .width($(window).width());
                
                
                
                var nvAlturaImg     = 0;
                var nvLarguraImg    = 0;
                //pega  a altura e largura da imagem
                var heightImg = this.height,
                        widthImg = this.width;                  
                
                var telaHeight =  window.innerHeight,//screen.height,
                        telaWidth =  window.innerWidth //screen.width;
                
                
                if(heightImg >= widthImg){
                    
                    nvAlturaImg     =  parseInt(telaHeight - (telaHeight*0.20));                    
                    document.querySelector("#cd-img img").height = nvAlturaImg;
                    
                }else{
                    
                    if( widthImg <= telaWidth ){
                        nvLarguraImg = widthImg;
                    }else{
                        nvLarguraImg =  parseInt(telaWidth - (telaWidth*0.20) );
                        
                        if(nvLarguraImg >= widthImg){
                            nvLarguraImg = widthImg;
                        }
                    }
                    
                    
                    document.querySelector("#cd-img img").width = nvLarguraImg;
                    
                }
                
                //$("#cd-img #cdimg img").height($(window).height());
                
                
                
               
                
                
                // var tImg = imgLoad(sImg);
                 
                // alert(tImg);
                 /*
                // pega a altura imagem thumbs e adiciona a altura no UL
                //var myImg       = document.querySelector("#cd-img img");
                var myImg       = document.querySelector("#cd-img");
                var currHeight  = myImg.clientHeight;
                var currwidth   = myImg.clientWidth;
               
                $("#cd-img").css({                    
                    'height'        : (($(window).height()) - 100) + 'px',
                    'margin-left'   : '-'+( currwidth/2) + 'px',
                });
                */
                
                /*
                $("#cd-img").css({
                    'width'         : (currwidth-50) + 'px',
                    'height'        : (currHeight-50) + 'px',
                    'margin-left'   : '-'+( (currwidth-50)/2 )+'px',
                    'margin-top'    : '-'+( (currHeight-50)/2 )+'px',
                });
                
                
                 $("#cd-img img").height( (currHeight-50) )
                         .width( (currwidth-50) );
                 */
                //if(currwidth >= currHeight ){
                    
                    //$("#cd-img").height( (currHeight-50) );
                //}
                //alert(currHeight );
                
                
                
            }).attr('src',sImg);            
            
            /*
            var iLoad = new Image();
            // evento disparado quando a imagem terminou o carregamento
            iLoad.onload = function() {
                
                var nvAlturaImg     = 0;
                var nvLarguraImg    = 0;
                //pega  a altura e largura da imagem
                var heightImg = this.height,
                        widthImg = this.width;                  
                
                var telaHeight =  window.innerHeight,//screen.height,
                        telaWidth =  window.innerWidth //screen.width;
                
                
                if(heightImg >= widthImg){
                    
                    nvAlturaImg     =  parseInt(telaHeight -   (telaHeight*0.15));                    
                    document.querySelector("#cd-img img").height = nvAlturaImg;
                    
                }else{
                    
                    nvLarguraImg    = (telaWidth*widthImg)/widthImg;
                    
                    if(nvLarguraImg >= widthImg ){
                        nvLarguraImg = (widthImg-100);
                    }
                    
                    document.querySelector("#cd-img img").width = nvLarguraImg;
                    
                }
            };
            iLoad.src = sImg;
            */
        };
        
        function fecharImg(){
            
             $("body").css({
                'overflow': 'auto'
            });
            
            $("#top-header").fadeIn();
            
            $('#localimg').remove();
            $('#cd-img').remove();
            $('#fecharimg').remove();
            
        }
        
       function ShowImg(){
           var srcImg = $("#imgShow img").data('ishow');
           SImg(srcImg);
        };
        
       function fecharTela(){
          $('#apress').remove();
          $('.cd-catg').fadeIn();
          
          // $("#colecao h2").html();
          // $("#colecao h2").html(h2Colecao);
          $("#catalogo").removeClass('loadcolec');
          $("#loadimgshow").remove();
           $(".avscolec").css({'display' : 'block'});
  
       }
        // funcao para mostrar as imagens anteriores
        function prevClick(){
            
            var activeAtaul = 0;
            
             cPrev++;
           
            if(cPrev == 1){
            $('#quadrado .fd-branco').fadeIn(); 
            
            // localiza o imagem ativa
            $(".cnt-img ul li").each(function(i){
                if( $(this).hasClass('active') ){
                    activeAtaul = i;
                    $(this).removeClass('active');
                }
            });
            
            // adiciona a classe active na proxima div/imagem
            $(".cnt-img ul li").eq( (activeAtaul-1) ).addClass('active');
            
            // mostra a imagem central
            var iCentral    = $(".cnt-img ul li").eq( (activeAtaul-1) ).data('imgcenter');
            var iShow       = $(".cnt-img ul li").eq( (activeAtaul-1) ).data('img');
            
            showImage(iCentral,iShow);
            
            // desativa o botÃ£o para evitar erro
            $("#prev").attr('disabled', 'disabled');
            
            // pega a left atyal do 
            // div/ul com todas as imagens
            var marginAtualPrev = parseFloat($(".cnt-img ul").css('left').split('px')[0]);            
            
            // tamanho da imagem
            var mAtual          = parseFloat(tamanhoImagem);            
            
            // se left for maior ou igual a zero clona 
            // a ultima imagem e insere ela em primeiro
            if( (marginAtualPrev) >= 0 ){
                
                // clona os elementos para duplicar
                $('#apress .cnt-img ul li:last-child').clone(true).prependTo('#apress .cnt-img ul');
                $('#apress .cnt-img ul li:last-child').remove();
                
                // calcula a nova posiÃ§Ã£o atual menos a tamanho da imagem 
                // e inseri o novo valor via css
                var nvLeftNext = marginAtualPrev - tamanhoImagem;                
                $(".cnt-img ul").css({'left': nvLeftNext});
            }
            // realiza o movimento com base no tamanho da div/imagem
            $("#apress .cnt-img ul").animate({ 
                "left": "+="+mAtual+"px"
            },"slow",function(){
                  //ativa o botÃ£o apos o termino da animaÃ§Ã£o
                  $("#prev").removeAttr('disabled');
                  
                   if(  cPrev >=1){
                       cPrev = 0;
                  }
              });
        }
        }
        function nextClick(){
            
            var activeAtaul = 0;
            
            cNext++;
           
            if(cNext == 1){
           
            $('#quadrado .fd-branco').fadeIn(); 
            
            // localiza o imagem ativa
            $(".cnt-img ul li").each(function(i){
                if( $(this).hasClass('active') ){
                    activeAtaul = i;
                    $(this).removeClass('active');
                }
            });
            
            // adiciona a classe active na proxima div/imagem
            $(".cnt-img ul li").eq( (activeAtaul+1) ).addClass('active');
            
            // mostra a imagem central
            var iCentral    = $(".cnt-img ul li").eq( (activeAtaul+1) ).data('imgcenter');
            var iShow       = $(".cnt-img ul li").eq( (activeAtaul+1) ).data('img');
            
            showImage(iCentral,iShow);
            
            // desativa o botÃ£o para evitar erro
            $("#next").attr('disabled', 'disabled');
            
            // pega a left atyal do 
            // div/ul com todas as imagens
            var marginAtualNext = parseFloat($(".cnt-img ul").css('left').split('px')[0]);
            
            // tamanho da imagem
            var mAtualNext      = parseFloat(tamanhoImagem);
            
            //alert(widthTodasImagens)
            
            // trabalhos com o valor absoluto do left e se maior ou igual ao 
            // tamanho de todas as imagens - a div onde mostra as imagens 
            // clona a ultima imagem e insere ela em ultimo lugar e remove a primenra
            if( (Math.abs(marginAtualNext)) >= (widthTodasImagens - (ApressWidth+tamanhoImagem) )  ){
                
                 // clona os elementos para duplicar e insere em ultimo
                 $('#apress .cnt-img ul li:first-child').clone(true).appendTo('#apress .cnt-img ul');
                 
                 // remove a primeira imagem apos ser clonada
                 $('#apress .cnt-img ul li:first-child').remove();
                
                // calcula a nova posiÃ§Ã£o atual menos a tamanho da imagem 
                // e inseri o novo valor via css
                var nvLeftNext = marginAtualNext + tamanhoImagem;
                $(".cnt-img ul").css({'left': nvLeftNext});
                   
            }
            // realiza o movimento com base no tamanho da div/imagem
              $("#apress .cnt-img ul").animate({ 
                  "left": "-="+mAtualNext+"px"
              },"slow",function(){
                  //ativa o botÃ£o apos o termino da animaÃ§Ã£o
                  $("#next").removeAttr('disabled');
                  if(  cNext >=1){
                       cNext = 0;
                  }
              });
              
        }  
        }
        
          function imgLoad(img){
            //  var tamanhos = new Array();
              var iLoad = new Image();
              // evento disparado quando a imagem terminou o carregamento
              iLoad.onload = function() {
                  var height = this.height,
                          width = this.width;                  
              };
              iLoad.src = img;
          alert( height);
           // return [height,width];
        }
                         
        
    };

})(jQuery);


