/*
---
description: A Google Charts API helper class family

license: MIT-style

authors:
- Arieh Glazer

requires:
- core/1.3 : [Core,Class,Class.Extras,Element,Element.Event,Array]

provides: [GCharts,GCharts.Graphs,GCharts.Columns,GCharts.Lines,GCharts.Pies]

...
*/
/*!
Copyright (c) 2010 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/
GCharts = new Class({
    Implements : [Options]
    , image :null
    , options : {
        defaultColor : ''
        , generate : true
        , labels : true
        , legend : true
        , legendPosition : 'left'
        , target : null
        , title : ''
        , sizeX : 300
        , sizeY : 150
    }
    , legendPositions : {
        'bottom' : 'b'
        , 'bottom-vertical' : 'bv'
        , 'top' : 't'
        , 'top-vertical' : 'tv'
        , 'right' : 'r'
        , 'left' : 'l'
    }
    , names : []
    , colors : []
    , api_src : 'http://chart.apis.google.com/chart?'
    , src  : ''
    , items : []
    , initialize : function(items,opts){
        this.setOptions(opts);
        items.each(this.addItem.bind(this));
        this.src = this.api_src;
        
        if (this.options.generate){
            this.generateUrl();
            this.generateImage();
        }
    }
    , addItem : function(item){                
        this.colors.push(item.color || this.options.defaultColor);
        this.items.push(item.value);
        this.names.push(encodeURIComponent(item.name) || '');
    }
    , generateImage : function(){
        var $this = this;
        this.image = new Image();
        this.image.addEvent('load',function(){
            if ($this.options.target) $this.image.inject($this.options.target);
        });
        this.image.src = this.src;
    }
    , generateUrl : function(){
        this.src += "&chs="+this.options.sizeX+"x"+this.options.sizeY;
        if (this.options.title) this.src += "&chtt="+this.options.title.replace("\n","|");
        if (this.options.legend){
            this.src += "&chdl=" + this.names.join('|');
            this.src += "&chdlp=" + ((this.legendPositions[this.options.legendPosition]) ? this.legendPositions[this.options.legendPosition] : 'l')
        }
        
        if (!this.options.rangeX && !this.options.rangeY) return;
        this.src += "&chxr=";
        if (this.options.rangeX) this.src += '0,' + this.options.rangeX.join(',');
        if (this.options.rangeY) this.src += '|1,' + this.options.rangeY.join(',');
        if (this.options.labels) this.src +='&chm=N,000000,0,-1,11';            
 
       
    }
    , toElement : function(){return $this.image;}
});

GCharts.Graphs = new Class({
    Extends : GCharts
    , options : {
        titleX : false
        , titleY : false
        , showX : true
        , showY : true
        , rangeY : false
        , rangeX : false        
    }
    , initialize : function(items,opts){
        this.parent(items,opts);
    }
    , generateUrl : function(){  
        
        if (this.options.showX || this.options.showY) this.src += '&chxt=';
        if (this.options.showX) this.src+='x';
        if (this.options.showY) this.src += this.options.showX ? ',y' : 'y'; 
                
        if (this.options.titleX || this.options.titleY) this.src +='&chxl=';
        
        if (this.options.titleX){ 
            if (typeof this.options.titleX != 'string')            
                 this.src += '0:|'+this.options.titleX.join('|');
            else this.src += this.options.titleX
        }         
        if (this.options.titleY){   
            if (typeof this.options.titleY != 'string')            
                 this.src += ((this.options.titleX) ? '|' : '') +  '1:|'+this.options.titleY.join('|');
            else this.src += ((this.options.titleX) ? '|' : '') + this.options.titleY;
        }
        
        if (this.options.rangeX || this.options.rangeY) this.src += '&chxr=';
        if (this.options.rangeX) this.src += '0:'+this.options.rangeX.join(',');
        if (this.options.rangeY) this.src += ((this.options.rangeX) ? '|' : '') + '1:'+this.options.rangeY.join(',');
        
        this.parent();    
        
    }
});

GCharts.Columns = new Class({
    Extends : GCharts.Graphs
    , options : {
        direction : 'vertical'
        , width : '23'
        , space : '4'
        , rangeX : false
    }
    , vertical : true
    , initialize : function(items,opts){
        this.verical = (opts.direction == 'horizontal') ? false : true;
        this.parent(items,opts);
    }
    , generateUrl : function(){     
       
        if (!this.options.titleX) this.options.titleX = this.names;
       
       if (!this.vertical){
            var temp = this.options.rangeY;
            this.options.rangeY = this.options.rangeX;
            this.options.rangeX = temp;
            
            temp = this.options.titleX;
            this.options.titleX = this.options.titleY;
            this.options.titleY = temp;
        }        
        
        this.src += "&chco=" + this.colors.join('|');
      
        this.src += this.vertical ? '&cht=bvg' : '&cht=bhg';
        this.src += '&chd=t:' + this.items.join(',');
        this.src += '&chbh=' + this.options.width +',' +this.options.space;
        this.parent();
    }
});

GCharts.Lines = new Class({
    Extends : GCharts.Graphs
    , options :{
        labels : false
        , markers : true
        , markerColor : '000000'
        , showX : false
        , showY : false
    }
    , styles : []
    , addItem : function(item){
        this.parent(item);
        var style = [item.width || 1];
        if (item.dashs || item.gaps ){
            style.push(item.dashs);
            style.push(item.gaps);
        }
        this.styles.push(style);        
    }
    , generateUrl : function(){
        this.src += "&cht=lxy";
        this.src += '&chd=t:'
        var line = '',$this = this;
        
        this.items.each(function(item){
            if (typeOf( item[0]) != 'array') $this.src += line + '-1|' + item.join(',');
            else{
                var x= [], y=[],i,l;
                for (i=0,l=item.length ; i<l ; i++){
                    x.push(item[i][0]);
                    y.push(item[i][1]);
                }  
                $this.src+=line+x.join(',')+'|'+y.join(',');
            }
            
            line = '|';
        });
        line = '';
        this.src += "&chls=";
        
        this.styles.each(function(style){
            $this.src+=line+style.join(',');
            line = '|';
        });       
        this.src += "&chco=" + this.colors.join(','); 
        if (this.options.markers) this.src += '&chm=o,'+this.options.markerColor+',0,-1,3';
            
        this.parent();
    }
});

GCharts.Pie = new Class({
    Extends : GCharts
    , options : {
        '3d' : false
    }
    , generateUrl : function(){
        this.src += '&chd=t:' + this.items.join(',');
        this.src += '&cht=p';
        if (this.options['3d']) this.src+='3';
        if (this.options.labels) this.src += '&chl=' + this.names.join('|');
        this.src += "&chco=" + this.colors.join('|');
        this.parent();
    }
});