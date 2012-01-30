(function($) {  

    $.widget("ui.pics_comments", {  
        variables: {
            comments_window: null,
            photo_id: 0,
            jscroll_api: null
        },
        options: {
            flickr_api_key: "0ea5ee58d2b177cba257f022e61e8b36",  
            selector: ".fancybox"
        },
        _create: function() {        
            var _self = this,  
            o = _self.options,  
            v = _self.variables,
            el = _self.element;
            
            console.log("CREATED");
            
            el.find(o.selector).fancybox({
                margin: 60,
                prevEffect	: 'none',
		nextEffect	: 'none',
		beforeShow      : function(){
                    var photo_id = /([\d]+)_/.exec(this.href)[1];
                    _self.createCommentsWindow(photo_id);
                },
                beforeClose      : function(){
                    _self.destroyCommentsWindow();
                }
            });
            
            $(window).bind("resize", function(){ _self.resizeCommentsWindow(); }); 
            
        },
        createCommentsWindow: function(photo_id){
            
            var _self = this,  
            o = _self.options,  
            v = _self.variables;

            if( !v.comments_window ){
                v.comments_window = $('<div></div>')
                .attr('id', 'comments')
                .addClass('comments_box');
                v.comments_window.appendTo($('body'));
                
            }
            v.comments_window.show();
            
            
            _self.resizeCommentsWindow();

            $.getJSON(
                "http://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&format=json&jsoncallback=?",
                {"api_key" : o.flickr_api_key, "photo_id" : photo_id}, 
                function(data){
                    if( v.jscroll_api ){
                        v.jscroll_api.destroy();
                        v.jscroll_api = null;
                        v.comments_window.attr('style','');
                        _self.resizeCommentsWindow();
                    }                    
                    v.comments_window.children().remove();
                    var comments = data.comments.comment;
                    $("#comment-block").tmpl(comments).appendTo(v.comments_window);

                    v.jscroll_api = v.comments_window.jScrollPane().data.jsp;
                }
            );
        },
        resizeCommentsWindow: function(){
            var _self = this,  
            v = _self.variables;

            if( v.comments_window ){
                var wh = $(window).height();
                
                var vtop = v.comments_window.position().top - $(document).scrollTop();
                console.log('wh: '+wh+', top: '+vtop);
                // console.log((wh - v.comments_window.position().top - 30));
                v.comments_window.css({ 
                    'height' : (wh - vtop - 30) + 'px'
                });
            }
            
        }, 
        destroyCommentsWindow: function(){
            var _self = this,  
            v = _self.variables;
            
            if( v.comments_window ){
                v.comments_window.hide();
            }
        },
        destroy: function() {  
            $(window).unbind("resize"); 
        }
    });

})(jQuery); 