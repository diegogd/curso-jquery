(function($) {  
    $.widget("ui.pic_tagging", {  
        variables: {
            picture_tags_changed: true,
            picture_tags: [
                {
                    top_x: 30,
                    top_y: 30,
                    bottom_x: 150,
                    bottom_y: 150,
                    message: 'example'
                }
            ],
            tag_skeleton: {
                top_x: null,
                top_y: null,
                bottom_x: null,
                bottom_y: null,
                message: null
            }
        },
        options: {
            picture_id: 0
        },
        _create: function() {        
            var _self = this,  
            o = _self.options,  
            v = _self.variables,
            el = _self.element;
            
            $('#add_tag_bt').remove();
            $('<button id="add_tag_bt" class="btn success">Añadir etiqueta</a>')
            .css({
                'bottom': '-30px',
                'position': 'absolute'
            })
            .appendTo(el.parent().parent()).show()
            .click(function(){
                v.picture_tags[v.picture_tags.length] = {
                    top_x: 20,
                    top_y: 20,
                    bottom_x: 100,
                    bottom_y: 100,
                    message: 'nuevo'
                };
                _self._drawTags();
            });
            _self._loadPictureData();
        },
        _drawTags: function(){
            var _self = this,  
            o = _self.options,  
            v = _self.variables,
            el = _self.element;
            
            $('.picture_tag').remove();
            for(i in v.picture_tags){
                var tag = v.picture_tags[i];
                $('<div class="picture_tag"></div>')
                .css({
                    'top': tag.top_x + 'px',
                    'left': tag.top_y + 'px',
                    'width': (tag.bottom_x - tag.top_x) + 'px',
                    'height': (tag.bottom_y - tag.top_y) + 'px'
                    })
                .append(
                    $('<span></span>')
                    .addClass('message')
                    .text(tag.message)
                    .click(function(){
                        var span = $(this);
                        span.hide().after(
                            $('<input></input>')
                            .val($(this).text())
                            .show()
                            .css({'top': '-30px', 'font-size':'0.8em', 'position': 'absolute', 'width':'50px'})
                            .bind('blur',function(){
                                v.picture_tags_changed = true;
                                tag.message=$(this).val();
                                span.text(tag.message).show();
                                $(this).remove();
                            })
                            .focus()
                            
                        );
                    })
                )
                .appendTo(el)
                .draggable({
                    stop: function() {
                        diff_x = $(this).position().top - tag.top_x;
                        diff_y = $(this).position().left - tag.top_y;
                        
                        tag.top_x += diff_x;
                        tag.top_y += diff_y;
                        tag.bottom_x += diff_x;
                        tag.bottom_y += diff_y;
                        
                        v.picture_tags_changed = true;                        
                    }
                });
            }           
        },
        _loadPictureData: function(){
            var _self = this,  
            o = _self.options,
            v = _self.variables;
            
            var ourCallback = function(value, key) {
                console.log('The value of ' + key + ' is ' + value);
              
                var json = null;                
                try{
                    json = $.evalJSON(value);
                } catch(e) {}
                
                if( json != null ){
                    v.picture_tags = json;
                    v.picture_tags_changed = false;
                } else {
                    v.picture_tags = [];
                }
                
                _self._drawTags();
            };
            window.remoteStorage.getItem('pic_tag_'+o.picture_id, ourCallback);
        },
        _storePictureData: function(){
            var _self = this,  
            o = _self.options,
            v = _self.variables;
            
            if( v.picture_tags_changed ){ 
                console.log('Storing data '+$.toJSON(v.picture_tags));
                window.remoteStorage.setItem('pic_tag_'+o.picture_id, $.toJSON(v.picture_tags));
            }
        },
        destroy: function() {
            this._storePictureData();
            $(window).unbind("resize"); 
        }
    });
})(jQuery); 