// jQuery File Tree Plugin
//
// Version 1.0
//
// Base on the work of Cory S.N. LaViska  A Beautiful Site (http://abeautifulsite.net/)
// Dual-licensed under the GNU General Public License and the MIT License
// Icons from famfamfam silk icon set thanks to http://www.famfamfam.com/lab/icons/silk/
//
// Usage : $('#jao').jaofiletree(wpfd_options);
//
// Author: Damien Barrère
// Website: http://www.crac-design.com

(function( $ ) {

    var wpfd_options =  {
      'root'            : '/',
      'script'         : 'connectors/jaoconnector.php',
      'showroot'        : 'root',
      'onclick'         : function(elem,type,file){},
      'oncheck'         : function(elem,checked,type,file){},
      'usecheckboxes'   : true, //can be true files dirs or false
      'expandSpeed'     : 500,
      'collapseSpeed'   : 500,
      'expandEasing'    : null,
      'collapseEasing'  : null,
      'canselect'       : true
    };

    var wpfd_methods = {

        init : function( o ) {
            if($(this).length==0){
                return;
            }
            $this = $(this);
            $.extend(wpfd_options,o);

            if(wpfd_options.showroot!=''){
                checkboxes = '';
                if(wpfd_options.usecheckboxes===true || wpfd_options.usecheckboxes==='dirs'){
                    checkboxes = '<input type="checkbox" />';
                }
                $this.html('<ul class="jaofiletree"><li class="drive directory collapsed selected">'+checkboxes+'<a href="#" data-file="'+wpfd_options.root+'" data-type="dir">'+wpfd_options.showroot+'</a></li></ul>');
            }
            wpfd_methods.openfolder(wpfd_options.root);
        },
        open : function(dir){
            wpfd_methods.openfolder(dir);
        },
        close : function(dir){
            wpfd_methods.closedir(dir);
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
        },

        openfolder : function(dir) {
            if($this.find('a[data-file="'+dir+'"]').parent().hasClass('expanded')){
                return;
            }
            var ret;
            ret = $.ajax({
                url : wpfd_options.script,
                data : {dir : dir},
                context : $this,
                dataType: 'json',
                beforeSend : function(){this.find('a[data-file="'+dir+'"]').parent().addClass('wait');}
            }).done(function(datas) {
                ret = '<ul class="jaofiletree" style="display: none">';
                for(ij=0; ij<datas.length; ij++){
                    if(datas[ij].type=='dir'){
                        classe = 'directory collapsed';
                        isdir = '/';
                    }else{
                        classe = 'file ext_'+datas[ij].ext;
                        isdir = '';
                    }
                    ret += '<li class="'+classe+'">'
                    if(wpfd_options.usecheckboxes===true || (wpfd_options.usecheckboxes==='dirs' && datas[ij].type=='dir') || (wpfd_options.usecheckboxes==='files' && datas[ij].type=='file')){
                        ret += '<input type="checkbox" data-file="'+dir+datas[ij].file+'" data-type="'+datas[ij].type+'"/>';
                    }
                    else{
    //                        ret += '<input disabled="disabled" type="checkbox" data-file="'+dir+datas[ij].file+'" data-type="'+datas[ij].type+'"/>';
                    }
                    ret += '<a href="#" data-file="'+dir+datas[ij].file+isdir+'" data-type="'+datas[ij].type+'">'+datas[ij].file+'</a>';
                    ret += '</li>';
                }
                ret += '</ul>';

                this.find('a[data-file="'+dir+'"]').parent().removeClass('wait').removeClass('collapsed').addClass('expanded');
                this.find('a[data-file="'+dir+'"]').after(ret);
                this.find('a[data-file="'+dir+'"]').next().slideDown(wpfd_options.expandSpeed,wpfd_options.expandEasing);

                if(wpfd_options.usecheckboxes){
                    this.find('li input[type="checkbox"]').prop('checked',null);
                    this.find('a[data-file="'+dir+'"]').prev(':not(:disabled)').prop('checked','checked');
                    this.find('a[data-file="'+dir+'"] + ul li input[type="checkbox"]:not(:disabled)').prop('checked','checked');
                }

                wpfd_methods.setevents();
            }).done(function(){
                //Trigger custom event
                $this.trigger('afteropen');
                $this.trigger('afterupdate');
            });
        },

        closedir : function(dir) {
            $this.find('a[data-file="'+dir+'"]').next().slideUp(wpfd_options.collapseSpeed,wpfd_options.collapseEasing,function(){$(this).remove();});
            $this.find('a[data-file="'+dir+'"]').parent().removeClass('expanded').addClass('collapsed');
            wpfd_methods.setevents();

            //Trigger custom event
            $this.trigger('afterclose');
            $this.trigger('afterupdate');

        },

        setevents : function(){
            $this.find('li a').unbind('click');
            //Bind userdefined function on click an element
            $this.find('li a').bind('click', function() {
                wpfd_options.onclick(this, $(this).attr('data-type'),$(this).attr('data-file'));
                if(wpfd_options.usecheckboxes && $(this).attr('data-type')=='file'){
                    $this.find('li input[type="checkbox"]').prop('checked',null);
                    $(this).prev(':not(:disabled)').prop('checked','checked');
                    $(this).prev(':not(:disabled)').trigger('check');
                }
                if(wpfd_options.canselect){
                    $this.find('li').removeClass('selected');
                    $(this).parent().addClass('selected');
                }
                return false;
            });
            //Bind checkbox check/uncheck
            $this.find('li input[type="checkbox"]').bind('change', function() {
                wpfd_options.oncheck(this,$(this).is(':checked'), $(this).next().attr('data-type'),$(this).next().attr('data-file'));
                if($(this).is(':checked')){
                    $this.trigger('check');
                }else{
                    $this.trigger('uncheck');
                }
            });
            //Bind for collapse or expand elements
            $this.find('li.directory.collapsed a').bind('click', function() {
                if (!$(this).parent().hasClass('wait')) {
                    wpfd_methods.open($(this).attr('data-file'));
                }
                return false;}
            );
            $this.find('li.directory.expanded a').bind('click', function() {wpfd_methods.close($(this).attr('data-file'));return false;});
        },

    };

    $.fn.wpfd_jaofiletree = function( method ) {
        // Method calling logic
        if ( wpfd_methods[method] ) {
            return wpfd_methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return wpfd_methods.init.apply( this, arguments );
        } else {
            //error
        }    
  };
})( jQuery );
