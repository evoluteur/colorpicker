/*!
 * Evol.ColorPicker 0.1
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
	baseThemeColors=['FFFFFF','000000','EEECE1','1F497D','4F81BD','C0504D','9BBB59','8064A2','4BACC6','F79646'],
	subThemeColors=['F2F2F2','7F7F7F','DDD9C3','C6D9F0','DBE5F1','F2DCDB','EBF1DD','E5E0EC','DBEEF3','FDEADA',
		'D8D8D8','595959','C4BD97','8DB3E2','B8CCE4','E5B9B7','D7E3BC','CCC1D9','B7DDE8','FBD5B5',
		'BFBFBF','3F3F3F','938953','548DD4','95B3D7','D99694','C3D69B','B2A2C7','92CDDC','FAC08F',
		'A5A5A5','262626','494429','17365D','366092','953734','76923C','5F497A','31859B','E36C09',
		'7F7F7F','0C0C0C','1D1B10','0F243E','244061','632423','4F6128','3F3151','205867','974806'],
	standardColors=['C00000','FF0000','FFC000','FFFF00','92D050','00B050','00B0F0','0070C0','002060','7030A0'],
	moreColors=[
		['003366','336699','3366CC','003399','000099','0000CC','000066'],
		['006666','006699','0099CC','0066CC','0033CC','0000FF','3333FF','333399'],
		['669999','009999','33CCCC','00CCFF','0099FF','0066FF','3366FF','3333CC','666699'],
		['339966','00CC99','00FFCC','00FFFF','33CCFF','3399FF','6699FF','6666FF','6600FF','6600CC'],
		['339933','00CC66','00FF99','66FFCC','66FFFF','66CCFF','99CCFF','9999FF','9966FF','9933FF','9900FF'],
		['006600','00CC00','00FF00','66FF99','99FFCC','CCFFFF','CCCCFF','CC99FF','CC66FF','CC33FF','CC00FF','9900CC'],
		['003300','009933','33CC33','66FF66','99FF99','CCFFCC','FFFFFF','FFCCFF','FF99FF','FF66FF','FF00FF','CC00CC','660066'],
		['333300','009900','66FF33','99FF66','CCFF99','FFFFCC','FFCCCC','FF99CC','FF66CC','FF33CC','CC0099','993399'],
		['336600','669900','99FF33','CCFF66','FFFF99','FFCC99','FF9999','FF6699','FF3399','CC3399','990099'],
		['666633','99CC00','CCFF33','FFFF66','FFCC66','FF9966','FF6666','FF0066','D60094','993366'],
		['a58800','CCCC00','FFFF00','FFCC00','FF9933','FF6600','FF0033','CC0066','660033'],
		['996633','CC9900','FF9900','CC6600','FF3300','FF0000','CC0000','990033'],
		['663300','996600','CC3300','993300','990000','800000','993333']
	];
			
$.widget( "evol.colorpicker", {

	version: '0.1',
	
	options: {
		color: null, // example default:'#31859B'
		strings: 'Theme Colors,Standard Colors,More Colors,Less Colors'
	},

	_create: function() {
		this._paletteIdx=1;
		this._id='evo-cp'+_idx++;
		var that=this;
		switch(this.element[0].tagName){
			case 'DIV':
			case 'SPAN':
				this._isPopup=false;
				this.element.html(this._paletteHTML())
					.find('.evo-more a').on('click', function(){
						that._switchPalette();
					});
				this._palette=this.element;
				this._cTxt=this._palette.find('div.evo-color').children().eq(0);
				this._bindColors();
				break;
			case 'INPUT':
				var color=this.options.color;
				this._isPopup=true;
				this._palette=null;
				if(color!=null){
					this.element.val(color);
				}
				this.element.addClass('colorPicker '+this._id)
					.wrap('<div style="width:'+(this.element.width()+32)+($.browser.mozilla?'px;padding:1px 0':'px;')+'"></div>')
					.after('<div class="evo-colorind'+($.browser.mozilla?'-ff':_ie)+'" '+
						(color!=null?'style="background-color:'+color+'"':'')
						+'></div>')
					.on('focus', function(){
						that.showPalette();
					})
					.on('keyup onpaste', function(evt){
						var c=$(this).val();
						if(c!=that.options.color){
							that._setValue(c, true);
						}
					})
					.next().on('click', function(evt){
						evt.stopPropagation();
						that.showPalette();
					})
				break; 
		}
	},

	_paletteHTML: function() {
		var h=[], pIdx=this._paletteIdx;
		h.push('<div class="evo-pop',_ie,' ui-widget ui-widget-content ui-corner-all"',
			this._isPopup?' style="position:absolute"':'', '>');
		h.push('<span>',this['_paletteHTML'+pIdx](),'</span>');
		h.push('<div class="evo-more"><a href="javascript:void(0)">',this.options.strings.split(',')[1+pIdx],'</a></div>');
		h.push('<div class="evo-color"><div style="display:none;"');
		if($.browser.msie){
			h.push(' class="evo-colorbox-ie">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><span class=".evo-colortxt-ie"/>');
		}else{		
			h.push('></div><span/>');
		}
		h.push('</div></div>');
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
			var h=i.toString(16).toUpperCase();
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
		for(var i=255;i>10;i=i-10){
			h.push(oTD, toHex(i), cTD);
			i=i-10;
			h2.push(oTD, toHex(i), cTD); 
		}
		h.push('</tr></table>',oTabTR,h2.join(''),'</tr></table>');	
		h.push('</div>');
		return h.join('');
	},

	_switchPalette: function() {		
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
	},

	showPalette: function() {
		$('.colorPicker').not('.'+this._id).colorpicker('hidePalette');
		if(this._palette==null){
			this._palette=this.element.next()
				.after(this._paletteHTML()).next()
				.on('click',function(evt){
					evt.stopPropagation();
				});
			this._cTxt=this._palette.find('div.evo-color').children().eq(0);
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
		var that=this;
		this._palette
			.on('click', 'td', function(evt){
				var c=$(this).attr('style').substring(17);
				that._setValue(c);
			})
			.on('mouseover', 'td', function(evt){
				var c=$(this).attr('style').substring(17);
				that._cTxt.attr('style','background-color:'+c)
					.next().html(c);
				that.element.triggerHandler({type:"color.hover", color:c});
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
	
	_setValue: function(c) {
		this.options.color=c;
		if(this._isPopup){
			this.hidePalette();
			this.element.val(c)
				.next().attr('style', 'background-color:'+c);
		}
		this.element.triggerHandler({type:"color.change", color:c});
	},
	
	_setOption: function(key, value) {
		this.options[key] = value;
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