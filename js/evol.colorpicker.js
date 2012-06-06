// (c) 2012 Olivier Giulieri 

$.widget( "evol.colorpicker", {

    options: {
		strings: 'Theme Colors,Standard Colors,More Colors,Less Colors',
		animation: 'slide' // possible values: 'fade' or 'slide'
	},

    _create: function() {
		this._paletteIdx=1;
		var e=$(this.element[0]);
		var that=this;
		switch(this.element[0].tagName){
			case 'DIV':
			case 'SPAN':
				this._isPopup=false;
				e.html(this._paletteHTML());
				this.elemPalette=e;
				this._bindColors();
				e.find('.evo-more a')
					.bind('click',function(){
						that._switchPalette()
					});
				break;
			case 'INPUT':
				var that=this; 
				this._isPopup=true;
				e.wrap('<div style="width:'+(e.width()+32)+'px"></div>')
					.after('<div class="evo-colorind"></div>')
					.bind('click', function(evt){
						evt.stopPropagation();
					})
					.bind('focus', function(){
						that.showPalette();
					})
				break; 
		}
		this._color=null;
    },

	_paletteHTML: function() {
		var isIE=$.browser.msie, h=[], pIdx=this._paletteIdx;
		h.push('<div class="evo-pop ui-widget ui-widget-content ui-corner-all"',
			this._isPopup?' style="position:absolute"':'', '>');
		h.push('<span id="p">');
		h.push(this['_paletteHTML'+pIdx]());
		h.push('</span><div class="evo-more"><a href="javascript:void(0)">',this.options.strings.split(',')[1+pIdx],'</a></div>');
		h.push('<div class="evo-color"></div></div>');
		return h.join(''); 
    },

	_paletteHTML1: function() {
		var labels=this.options.strings.split(','),
			baseThemeColors=['FFFFFF','000000','EEECE1','1F497D','4F81BD','C0504D','9BBB59','8064A2','4BACC6','F79646'],
			subThemeColors=['F2F2F2','7F7F7F','DDD9C3','C6D9F0','DBE5F1','F2DCDB','EBF1DD','E5E0EC','DBEEF3','FDEADA',
				'D8D8D8','595959','C4BD97','8DB3E2','B8CCE4','E5B9B7','D7E3BC','CCC1D9','B7DDE8','FBD5B5',
				'BFBFBF','3F3F3F','938953','548DD4','95B3D7','D99694','C3D69B','B2A2C7','92CDDC','FAC08F',
				'A5A5A5','262626','494429','17365D','366092','953734','76923C','5F497A','31859B','E36C09',
				'7F7F7F','0C0C0C','1D1B10','0F243E','244061','632423','4F6128','3F3151','205867','974806'],
			standardColors=['C00000','FF0000','FFC000','FFFF00','92D050','00B050','00B0F0','0070C0','002060','7030A0'];
		var isIE=$.browser.msie, h=[];
		var oTD='<td style="background-color:#',
			cTD=isIE?'"><div style="width:5px;"></div></td>':'"><span/></td>';
		// base theme colors
		h.push('<table class="evo-palette"><tr><th colspan="10" class="ui-widget-content">',labels[0],'</th></tr><tr>');
		for(var i=0;i<10;i++){ 
			h.push(oTD, baseThemeColors[i], cTD);
		}
		h.push('</tr>');
		if(!isIE){
			h.push('<tr><th colspan="10"><div class="sep"/></th></tr>');
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
		h.push('</tr><tr><th colspan="10" class="ui-widget-content">',labels[1],'</th></tr><tr>');
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
		var moreColors=[
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
		var isIE=$.browser.msie, h=[];
		var oTD='<td style="background-color:#',
			cTD=isIE?'"><div style="width:5px;"></div></td>':'"><span/></td>';			
		h.push('<div class="evo-palcenter">');
		if(isIE){
			h.push('<center>');
		}
		// hexagon colors
		for(var r=0,rMax=moreColors.length;r<rMax;r++){
			h.push('<table class="evo-palette2"><tr>');
			var cs=moreColors[r];
			for(var i=0,iMax=cs.length;i<iMax;i++){ 
				h.push(oTD, cs[i], cTD);
			}
			h.push('</tr></table>');
		}
		h.push('<div class="sep2"/>');
		// gray scale colors
		var h2=[];
		h.push('<table class="evo-palette2"><tr>');
		for(var i=255;i>10;i=i-10){
			h.push(oTD, toHex(i), cTD);
			i=i-10;
			h2.push(oTD, toHex(i), cTD); 
		}
		h.push('</tr></table><table class="evo-palette2"><tr>',h2.join(''),'</tr></table>');		
		if(isIE){
			h.push('</center>');
		}
		h.push('</div>');
		return h.join('');
    },

	_switchPalette: function() {		
		if(this._paletteIdx==2){
			var htm=this._paletteHTML1();
			this._paletteIdx=1;
		}else{
			var htm=this._paletteHTML2();
			this._paletteIdx=2;
		}
		this.elemPalette.find('#p').html(htm);
		this._bindColors();
		this.elemPalette.find('.evo-more a').html(this.options.strings.split(',')[this._paletteIdx+1]);
    },

	showPalette: function() {
		this.elemPalette=$(this.element[0]).next().after(this._paletteHTML()).next()
			.bind('click',function(evt){
				evt.stopPropagation();
			});
		this._bindColors();
		var that=this;
		$(document.body).bind('click',function(){
			that.hidePalette()
		});
		this.elemPalette.find('.evo-more a').bind('click',function(){
			that._switchPalette()
		});
    },	

	hidePalette: function() {
		if(this.elemPalette){
			this.elemPalette.find('td')
				.unbind();
			$(document.body)
				.unbind('click',this.hidePalette);
			this.elemPalette
				.unbind()
				.remove();
			this.elemPalette=null;
		}
    },

	_bindColors: function() {
		var that=this;
		this.elemPalette.find('td')
			.bind({
				click: function(evt){
					evt.stopPropagation();
					var c=$(this).attr('style').substring(17);
					if(that._isPopup){
						that.hidePalette();
						$(that.element[0])
							.val(c)
							.next().attr('style', 'background-color:'+c)
					}
					that._color=c;
					$(that.element[0]).triggerHandler({ type:"color.change", color:c});
				},
				mouseover: function(evt){
					var c=$(this).attr('style').substring(17);
					that.elemPalette.find('div.evo-color')
						.html('<div style="background-color:'+c+'"> </div><span>'+c+'</span>');
					$(that.element[0]).triggerHandler({ type:"color.hover", color:c});
				}
			})
    },

	val: function() {
        return this._color;
    },

    _setOption: function(key, value) {
        this.options[key] = value;
    },	

    destroy: function() {
		var e=$(this.element[0])
		if(this.elemPalette){
			this.elemPalette.find('td').unbind();
			this.elemPalette=null;
		}
		if(this._isPopup){
			e.unwrap()
				.unbind()				
				.next().remove();			
		}
		e.empty();
        $.Widget.prototype.destroy.call(this);
    }

});