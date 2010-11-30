GCharts
================
This package supplies a family of classes that use the Google Charts API to create chart images. They greatly simplify the process of creating such graphs.
The package currently support 3 chart types:

1. Column
2. Lines
3. Pie

I've only implemented the parts of these APIs that seemd most useful to me. 

How to use
----------

### Columns:

    #JS
    var columns = new GCharts.Columns([
            {name:'foo', value:10}
            , {name:'bar' , value:20}
    ],{
        target : document.body
    });
    
    
### Pie:

    #JS
    var lines = new GCharts.Pie([
            {name:'foo', value:10}
            , {name:'bar' , value:20}
    ],{
        target : document.body
    });
    
### Lines:

    #JS
    var lines = new GCharts.Liens([
            { name : 'foo' , value : [0,10,15,10,24,50,33,40]}
            { name : 'bar' , value : [10,30,50,22,33,44]}
    ],{
        target : document.body
    });