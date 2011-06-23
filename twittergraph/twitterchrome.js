Ext.require(['*']);

var theViewport;

Ext.onReady(function() {

	var twName = 'DanielPettersso';

	Ext.QuickTips.init();
    theViewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 0
        },
        items: [{
            region: 'north',
			padding: 2,
            collapsible: true,
            title: 'TwitterGraph <a href="http://uglyhack.appspot.com/artistgraph/">ArtistGraph</a>',
            height: 99,
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items: [{
					flex: 1,
					layout: {
						type: 'hbox'
					},
					html: 'Powered by <a href="http://github.com/mrdoob/three.js" target="_blank">three.js</a>,' + 
					'<a href="http://www.sencha.com/products/extjs" target="_blank">Ext JS</a>, ' + 
					'<a href="http://www.jquery.com" target="_blank">jQuery</a> and ' + 
					'<a href="http://www.twitter.com" target="_blank">Twitter</a>. ' + 
					'Made by <a href="mailto:daniel.g.pettersson@gmail.com">Daniel Pettersson</a></br>' +
					'MOVE mouse & press LEFT/A: rotate, MIDDLE/S: zoom, RIGHT/D: pan</br></br>',
					items: [
						{
							xtype: 'textfield',
							name: 'TwitterName',
							value: 'DanielPettersso',
							fieldLabel: 'TwitterName',
							listeners: {
								change: function(field, value){
									twName = value;
								}
							}
						},
						{
							xtype: 'button',
							text: 'Set',
							tooltip: 'Sets the entered Twitter username as root node in a new graph.',
							handler: function(){
								initScene();
								getRootNode(twName);
							}
							
						},
						{
							xtype: 'button',
							text: 'Add',
							tooltip: 'Adds the entered Twitter username to the graph. Name must exist already exist in the graph.',
							handler: function(){
								getTwitterData(twName);
							}
							
						}
					]
					
				},
				{
					flex: 1,
					html: '<iframe src="social.html" width="600" height="90" frameborder="0"></iframe>'
			}]
        },{
			id: 'sceneContainer',
			region: 'center',
            border: false,
			html: '<div id="scene" />'
        },{
			region: 'south',
			html: '<div id="statusText" />',
			height: 20
		}]
    });
	initTwitterGraph();
	getRootNode('DanielPettersso');
	
	
});