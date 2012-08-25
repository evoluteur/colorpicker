/*!
 * Evol.ColorPicker 1.0
 *
 * Copyright (c) 2012, Olivier Giulieri 
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

var _idx=0,
	_ie=$.browser.msie?'-ie':'',
	baseThemeColors=['ffffff','000000','eeece1','1f497d','4f81bd','c0504d','9bbb59','8064a2','4bacc6','f79646'],
	subThemeColors=['f2f2f2','7f7f7f','ddd9c3','c6d9f0','dbe5f1','f2dcdb','ebf1dd','e5e0ec','dbeef3','fdeada',
		'd8d8d8','595959','c4bd97','8db3e2','b8cce4','e5b9b7','d7e3bc','ccc1d9','b7dde8','fbd5b5',
		'bfbfbf','3f3f3f','938953','548dd4','95b3d7','d99694','c3d69b','b2a2c7','92cddc','fac08f',
		'a5a5a5','262626','494429','17365d','366092','953734','76923c','5f497a','31859b','e36c09',
		'7f7f7f','0c0c0c','1d1b10','0f243e','244061','632423','4f6128','3f3151','205867','974806'],
	standardColors=['c00000','ff0000','ffc000','ffff00','92d050','00b050','00b0f0','0070c0','002060','7030a0'],
	moreColors=[
		['003366','336699','3366cc','003399','000099','0000cc','000066'],
		['006666','006699','0099cc','0066cc','0033cc','0000ff','3333ff','333399'],
		['669999','009999','33cccc','00ccff','0099ff','0066ff','3366ff','3333cc','666699'],
		['339966','00cc99','00ffcc','00ffff','33ccff','3399ff','6699ff','6666ff','6600ff','6600cc'],
		['339933','00cc66','00ff99','66ffcc','66ffff','66ccff','99ccff','9999ff','9966ff','9933ff','9900ff'],
		['006600','00cc00','00ff00','66ff99','99ffcc','ccffff','ccccff','cc99ff','cc66ff','cc33ff','cc00ff','9900cc'],
		['003300','009933','33cc33','66ff66','99ff99','ccffcc','ffffff','ffccff','ff99ff','ff66ff','ff00ff','cc00cc','660066'],
		['333300','009900','66ff33','99ff66','ccff99','ffffcc','ffcccc','ff99cc','ff66cc','ff33cc','cc0099','993399'],
		['336600','669900','99ff33','ccff66','ffff99','ffcc99','ff9999','ff6699','ff3399','cc3399','990099'],
		['666633','99cc00','ccff33','ffff66','ffcc66','ff9966','ff6666','ff0066','d60094','993366'],
		['a58800','cccc00','ffff00','ffcc00','ff9933','ff6600','ff0033','cc0066','660033'],
		['996633','cc9900','ff9900','cc6600','ff3300','ff0000','cc0000','990033'],
		['663300','996600','cc3300','993300','990000','800000','993333']
	];
			
$.widget( "evol.colorpicker", {

	version: '1.0',
	
	options: {
		color: null, // example default:'#31859B'
		showOn: 'both', // possible values 'focus','button','both'
		strings: 'Theme Colors,Standard Colors,More Colors,Less Colors'
	},

	_create: function() {
		this._paletteIdx=1;
		this._id='evo-cp'+_idx++;
		this._enabled=true;
		var that=this;
		switch(this.element[0].tagName){
			case 'INPUT':
				var color=this.options.color,
					e=this.element;
				this._isPopup=true;
				this._palette=null;
				if(color!=null){
					e.val(color);
				}else{
					var v=e.val();
					if(v!=''){
						color=this.options.color=v;
					}
				}
				e.addClass('colorPicker '+this._id)
					.wrap('<div style="width:'+(this.element.width()+32)+'px;'
						+($.browser.msie?'margin-bottom:-21px;':'')
						+($.browser.mozilla?'padding:1px 0;':'')
						+'"></div>')
					.after('<div class="evo-colorind'+($.browser.mozilla?'-ff':_ie)+'" '+
						(color!=null?'style="background-color:'+color+'"':'')+'></div>')
					.on('keyup onpaste', function(evt){
						var c=$(this).val();
						if(c!=that.options.color){
							that._setValue(c, true);
						}
					});
				var showOn=this.options.showOn;
				if(showOn=='both' || showOn=='focus'){
					e.on('focus', function(){
						that.showPalette();
					})
				}
				if(showOn=='both' || showOn=='button'){
					e.next().on('click', function(evt){
						evt.stopPropagation();
						that.showPalette();
					});
				}
				break;
			default:
				this._isPopup=false;
				this.element.html(this._paletteHTML())
					.attr('aria-haspopup','true')
					.find('.evo-more a').on('click', function(){
						that._switchPalette();
					});
				this._palette=this.element;
				this._bindColors();
				break;
		}
	},

	_paletteHTML: function() {
		var h=[], pIdx=this._paletteIdx;
		h.push('<div class="evo-pop',_ie,' ui-widget ui-widget-content ui-corner-all"',
			this._isPopup?' style="position:absolute"':'', '>');
		h.push('<span>',this['_paletteHTML'+pIdx](),'</span>');
		h.push('<div class="evo-more"><a href="javascript:void(0)">',
			this.options.strings.split(',')[1+pIdx],'</a></div>');
		h.push(this._colorIndHTML(this.options.color,'left'));
		h.push(this._colorIndHTML('','right'));
		h.push('</div>');
		return h.join('');
	},

	_colorIndHTML: function(c,fl) {
		var h=[];
		h.push('<div class="evo-color" style="float:left"><div style="');
		h.push(c?'background-color:'+c:'display:none');
		if($.browser.msie){
			h.push('" class="evo-colorbox-ie"></div><span class=".evo-colortxt-ie" ');
		}else{
			h.push('"></div><span ');
		}
		h.push(c?'>'+c+'</span>':'/>');
		h.push('</div>');
		return h.join('');
	},

	_paletteHTML1: function() {
		var h=[], labels=this.options.strings.split(','),
			isIE=$.browser.msie,
			oTD='<td style="background-color:#',
			cTD=isIE?'"><div style="width:2px;"></div></td>':'"><span/></td>',
			oTRTH='<tr><th colspan="10" class="ui-widget-content">';
		// base theme colors
		h.push('<table class="evo-palette',_ie,'">',oTRTH,labels[0],'</th></tr><tr>');
		for(var i=0;i<10;i++){ 
			h.push(oTD, baseThemeColors[i], cTD);
		}
		h.push('</tr>');
		if(!isIE){
			h.push('<tr><th colspan="10"></th></tr>');
		}
		h.push('<tr class="top">');
		// theme colors
		for(var i=0;i<10;i++){ 
			h.push(oTD, subThemeColors[i], cTD);
		}
		for(var r=1;r<4;r++){
			h.push('</tr><tr class="in">');
			for(var i=0;i<10;i++){ 
				h.push(oTD, subThemeColors[r*10+i], cTD);
			}			
		}
		h.push('</tr><tr class="bottom">');
		for(var i=40;i<50;i++){ 
			h.push(oTD, subThemeColors[i], cTD);
		}
		h.push('</tr>',oTRTH,labels[1],'</th></tr><tr>');
		// standard colors
		for(var i=0;i<10;i++){ 
			h.push(oTD, standardColors[i], cTD);
		}
		h.push('</tr></table>');
		return h.join(''); 
	},

	_paletteHTML2: function() {
		function toHex(i){
			var h=i.toString(16);
			if(h.length==1){
				h='0'+h;
			}
			return h+h+h;
		};
		var h=[],
			oTD='<td style="background-color:#',
			cTD=$.browser.msie?'"><div style="width:5px;"></div></td>':'"><span/></td>',
			oTabTR='<table class="evo-palette2'+_ie+'"><tr>';
		h.push('<div class="evo-palcenter">');
		// hexagon colors
		for(var r=0,rMax=moreColors.length;r<rMax;r++){
			h.push(oTabTR);
			var cs=moreColors[r];
			for(var i=0,iMax=cs.length;i<iMax;i++){ 
				h.push(oTD, cs[i], cTD);
			}
			h.push('</tr></table>');
		}
		h.push('<div class="evo-sep"/>');
		// gray scale colors
		var h2=[];
		h.push(oTabTR);
		for(var i=255;i>10;i-=10){
			h.push(oTD, toHex(i), cTD);
			i-=10;
			h2.push(oTD, toHex(i), cTD); 
		}
		h.push('</tr></table>',oTabTR,h2.join(''),'</tr></table>');	
		h.push('</div>');
		return h.join('');
	},

	_switchPalette: function() {
		if(this._enabled){
			if(this._paletteIdx==2){
				var h=this._paletteHTML1();
				this._paletteIdx=1;
			}else{
				var h=this._paletteHTML2();
				this._paletteIdx=2;
			}
			this._palette.find('.evo-more')
				.prev().html(h).end()
				.children().eq(0).html(this.options.strings.split(',')[this._paletteIdx+1]);
		}
	},

	showPalette: function() {
		if(this._enabled){
			$('.colorPicker').not('.'+this._id).colorpicker('hidePalette');
			if(this._palette==null){
				this._palette=this.element.next()
					.after(this._paletteHTML()).next()
					.on('click',function(evt){
						evt.stopPropagation();
					});
				this._bindColors();
				var that=this;
				$(document.body).on('click.'+this._id,function(evt){
					if(evt.target!=that.element.get(0)){
						that.hidePalette();
					}
				})
				this._palette.find('.evo-more a').on('click', function(evt){
					that._switchPalette();
				});
			}
		}
		return this;
	},	

	hidePalette: function() {
		if(this._isPopup && this._palette){
			$(document.body).off('.'+this._id);
			var that=this;
			this._palette.off('mouseover click', 'td')
				.fadeOut(function(){
					that._palette.remove();
					that._palette=that._cTxt=null;
				})
		}
		return this;
	},

	_bindColors: function() {
		var es=this._palette.find('div.evo-color')
		this._cTxt1=es.eq(0).children().eq(0);
		this._cTxt2=es.eq(1).children().eq(0);
		var that=this;
		this._palette
			.on('click', 'td', function(evt){
				if(that._enabled){
					var c=$(this).attr('style').substring(17);
					that._setValue(c);
				}
			})
			.on('mouseover', 'td', function(evt){
				if(that._enabled){
					var c=$(this).attr('style').substring(17);
					that._setColorInd(c,2);
					that.element.triggerHandler({type:"color.hover", color:c});
				}
			})
	},

	val: function(value) {
		if (typeof value=='undefined') {
			return this.options.color;
		}else{
			this._setValue(value);
			return this;
		}
	},

	_setValue: function(c, noHide) {
		this.options.color=c;
		if(this._isPopup){
			if(!noHide){
				this.hidePalette();
			}
			this.element.val(c)
				.next().attr('style', 'background-color:'+c);
		}else{
			this._setColorInd(c,1);
		}
		this.element.triggerHandler({type:"color.change", color:c});
	},

	_setColorInd: function(c,idx) {
		this['_cTxt'+idx].attr('style','background-color:'+c)
			.next().html(c);
	},

	_setOption: function(key, value) {
		if(key=='color'){
			this._setValue(value, true)
		}else{
			this.options[key]=value;
		}
	},

	enable: function() {
		if(this._isPopup){
			this.element.removeAttr('disabled');
		}else{
			this.element.css({'opacity': '1'});
		}
		this.element.removeAttr('aria-disabled');
		this._enabled=true;
		return this;
	},

	disable: function() {
		if(this._isPopup){
			this.element.attr('disabled', 'disabled');
		}else{
			this.hidePalette()
				.element.css({'opacity': '0.3'});
		}
		this.element.attr('aria-disabled','true');
		this._enabled=false;
		return this;
	},

	isDisabled: function() {
		return !this._enabled;
	},

	destroy: function() {
		$(document.body).off('.'+this._id);
		if(this._palette){
			this._palette.off('mouseover click', 'td');
			if(this._isPopup){
				this._palette.remove();
			}
			this._palette=this._cTxt=null;
		}
		if(this._isPopup){
			this.element
				.next().off('click').remove()
				.end().off('focus').unwrap();						
		}
		this.element.removeClass('colorPicker '+this.id).empty();
		$.Widget.prototype.destroy.call(this);
	}

});

})(jQuery);