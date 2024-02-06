// jQuery File Tree Plugin
//
// Version 1.0
//
// Base on the work of Cory S.N. LaViska  A Beautiful Site (http://abeautifulsite.net/)
// Dual-licensed under the GNU General Public License and the MIT License
// Icons from famfamfam silk icon set thanks to http://www.famfamfam.com/lab/icons/silk/
//
// Usage : $('#jao').jaofiletree(options);
//
// Author: Damien Barrère
// Website: http://www.crac-design.com

(function( $ ) {
    var options =  {
      'root'            : '/',
      'script'          : 'connectors/jaoconnector.php',
      'showroot'        : 'root',
      'onclick'         : function(elem,type,file){},
      'oncheck'         : function(elem,checked,type,file){},
      'expanded'        : false,
      'expandedParent'  : false,
      'usecheckboxes'   : true, //can be true files dirs or false
      'expandSpeed'     : 0,
      'collapseSpeed'   : 0,
      'expandEasing'    : null,
      'collapseEasing'  : null,
      'canselect'       : true
    };

    var methods = {
        init : function( o ) {
            if($(this).length==0){
                return;
            }
            $this = $(this);
            $.extend(options,o);
            $(this).data('jaofiletree', $.extend({}, options));
            if (typeof wpfdparams !== 'undefined' && wpfdparams.hasOwnProperty('allow_category_tree_parent_expanded')) {
                options.expandedParent = parseInt(wpfdparams.allow_category_tree_parent_expanded) === 1 ? true : false;
            }
            // if(options.showroot!=''){
            //
            //     $this.html('<ul class="jaofiletree"><li class="drive directory collapsed selected">'+
            //         '<div class="icon-open-close" ></div>'
            //         + '<i class="zmdi zmdi-folder"></i><a href="#" data-file="'+options.root+'" data-type="dir">'+options.showroot+'</a></li></ul>');
            // }
            firstload(options.root, $this);
        },
        open : function(dir, $this){
            openfolder(dir, $this);
        },
        close : function(dir, $this){
            closedir(dir, $this);
        },
        getchecked : function(){
            var list = new Array();
            var ik = 0;
            $this.find('input:checked + a').each(function(){
                list[ik] = {
                    type : $(this).attr('data-type'),
                    file : $(this).attr('data-file')
                }
                ik++;
            });
       return list;
        },
        getselected : function(){
            var list = new Array();
            var ik = 0;
            $this.find('li.selected > a').each(function(){
                list[ik] = {
                    type : $(this).attr('data-type'),
                    file : $(this).attr('data-file')
                }
                ik++;
            });
       return list;
        }
    };
    firstload = function(dir, $this) {
        $.ajax({
            url : options.script,
            data : {dir : dir},
            context : $this,
            dataType: 'json',
            beforeSend : function(){this.find('a[data-file="'+dir+'"]').parent().addClass('wait');}
        }).done(function(datas) {
            if (typeof datas !== 'undefined' && datas.success) {
                if (typeof datas.data !== 'undefined' && datas.data) {
                    var tree = buildtree(datas.data, true, dir);
                    $this.html(tree);
                    if (options.expandedParent) {
                        setTimeout(function() {
                            if ($('.icon-open-close[data-parent_id=0]').length) {
                                $this.find('.icon-open-close[data-parent_id=0]').click();
                            } else {
                                if (typeof datas.data[0].term_id !== 'undefined' && $('.icon-open-close[data-id=' + datas.data[0].term_id + ']').length) {
                                    $this.find('.icon-open-close[data-id=' + datas.data[0].term_id + ']').click();
                                }
                            }
                        }, 100);
                    }
                    setevents($this);
                } else {
                    $this.html('No cat found');
                }
            } else {
                if (typeof datas.message !== 'undefined') {
                    $this.html(datas.message);
                } else {
                    $this.html('Something wrong! Please reload this page.');
                }
            }

        });
    };
    buildtree = function(datas, display, dir) {
        // Sort by term_group
        var sortable = [];
        for (var key in datas) {
            sortable.push(datas[key]);
        }
        datas = [];
        sortable.forEach(function(data) {
            if (typeof data !== 'function') {
                datas.push(data);
            }
        });
        ret = '<ul class="jaofiletree" ';
        if (options.expanded) {
            display === true;
        }
        if(display) {
            ret += '>';
        }else{
            ret += 'style="display: none">';
        }
        for (var id = 0; id < datas.length; id++) {
            classe = 'directory collapsed';
            if (options.expanded) {
                classe = 'directory expanded';
            }
            if (datas[id].term_id === 0) {
                classe = 'directory selected expanded';
            }
            ret += '<li class="'+classe+'">';
            if(typeof datas[id].children !== 'undefined' && datas[id].children.length > 0){
                ret += '<div class="icon-open-close" data-id="' + datas[id].term_id + '" data-parent_id="' + datas[id].parent + '" data-file="' +datas[id].term_id + '" ></div>';
            }
            // else{
            //     ret += '<div class="icon-open-close" data-id="' + datas[id].term_id + '" data-parent_id="' + datas[id].parent + '" data-file="' +datas[id].term_id + '"  ></div>';
            // }
            if(datas[id].term_id === dir) {
                ret += '<i class="zmdi zmdi-folder zmdi-folder-open"></i>';
            }else {
                ret += '<i class="zmdi zmdi-folder"></i>';
            }

            ret += '<a href="#" data-file="'+datas[id].term_id+'" >'+datas[id].name+'</a>';
            if (typeof datas[id].children !== 'undefined') {
                var display = options.expanded;
                if (datas[id].term_id === 0) {
                    display = true;
                }
                ret += buildtree(datas[id].children, display);
            }
            ret += '</li>';
        }
        ret += '</ul>';

        return ret;
    };

    openfolder = function(dir, $this) {

       if($this.find('a[data-file="'+dir+'"]').parent().hasClass('expanded')){
          return;
       }
        $this.find('a[data-file="'+dir+'"]').parent().removeClass('wait').removeClass('collapsed').addClass('expanded');
        $this.find('a[data-file="'+dir+'"]').next().slideDown(options.expandSpeed,options.expandEasing);
        setevents($this);
        //Trigger custom event
        $this.trigger('afteropen');
        $this.trigger('afterupdate');
    };

    closedir = function(dir, $this) {
            $this.find('a[data-file="'+dir+'"]').next().slideUp(options.collapseSpeed,options.collapseEasing);
            $this.find('a[data-file="'+dir+'"]').parent().removeClass('expanded').addClass('collapsed');
            setevents($this);

            //Trigger custom event
            $this.trigger('afterclose');
            $this.trigger('afterupdate');

    };

    setevents = function($this){
        var options = $this.data('jaofiletree');
        var allow_category_tree_click_scroll_up = false;
        if (typeof wpfdparams !== 'undefined' && wpfdparams.hasOwnProperty('allow_category_tree_click_scroll_up')) {
            allow_category_tree_click_scroll_up = parseInt(wpfdparams.allow_category_tree_click_scroll_up) === 1 ? true : false;
        }
        $this.find('li a, li .icon-open-close').unbind('click');
        //Bind userdefined function on click an element
        $this.find('li.directory a').bind('click', function(e) {

            $this.find('li').removeClass('selected');
            $this.find('i.zmdi').removeClass('zmdi-folder-open').addClass("zmdi-folder");
            $(this).parent().addClass('selected');
            $(this).parent().find(' > i.zmdi').addClass("zmdi-folder-open");
            var $el = $(this);
            if($el.data('clicked')){
                // Previously clicked, stop actions
                e.preventDefault();
                e.stopPropagation();
            }else{
                // Mark to ignore next click
                $el.data('clicked', true);
                options.onclick(this, $(this).attr('data-file'));
                // Unmark after 1 second
                window.setTimeout(function(){
                    $el.removeData('clicked');
                }, 1000)
            }

            if (allow_category_tree_click_scroll_up) {
                var offsetTop = $(this).closest(".wpfd-content").offset().top - 200;
                $('html, body').animate({
                    scrollTop: offsetTop
                }, 1000);
            }

            return false;
        });

        //Bind for collapse or expand elements
        //$this.find('li.directory.collapsed a').bind('click', function() {methods.open($(this).attr('data-file'));return false;});
       // $this.find('li.directory.expanded a').bind('click', function() {methods.close($(this).attr('data-file'));return false;});

        $this.find('li.directory.collapsed .icon-open-close').bind('click', function (e) {
                e.preventDefault;

               var $el = $(this);
               if($el.data('clicked')){
                   // Previously clicked, stop actions
                   e.preventDefault();
                   e.stopPropagation();
               }else{
                   // Mark to ignore next click
                   $el.data('clicked', true);
                   methods.open($(this).attr('data-file'), $this);
                   // Unmark after 1 second
                   window.setTimeout(function(){
                       $el.removeData('clicked');
                   }, 1000)
               }
        });

            $this.find('li.directory.expanded .icon-open-close').bind('click', function (e) {
                e.preventDefault;
                var $el = $(this);
                if($el.data('clicked')){
                    // Previously clicked, stop actions
                    e.preventDefault();
                    e.stopPropagation();
                }else{
                    // Mark to ignore next click
                    $el.data('clicked', true);
                    methods.close($(this).attr('data-file'), $this);
                    // Unmark after 1 second
                    window.setTimeout(function(){
                        $el.removeData('clicked');
                    }, 1000)
                }

            });

    };

    $.fn.jaofiletree = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            //error
        }
  };
})( jQuery );
