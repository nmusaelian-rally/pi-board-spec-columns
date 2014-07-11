Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
        var that = this;
        that._getStates().then({
            success: this._removeDuplicates,
            scope: this
        }).then({
            success: this._addBoard,
            scope: this
        }).then({
            success: function() {
                //success!
            },
            failure: function(error) {
                //oh noes!
            }
            });
    },
    
    _getStates: function(){
        var that = this;
        var types = ['PortfolioItem/Theme','PortfolioItem/Initiative','PortfolioItem/Feature'];
        var promises = _.map(types, function(type){
            return Rally.data.ModelFactory.getModel({ 
                type: type
            }).then({
                success: function(model){
                     return model.getField('State').getAllowedValueStore().load({ 
                    });
                }
            });
        });
        return Deft.Promise.all(promises);
    },
        
    _removeDuplicates: function(arrays){
        var that = this;
        that._allowedAttributeValues = [];
        that._allStateNames = [];
        that._allStateRefs = [];
        that._allStates = [];
        
        //debugger;
        _.each(arrays,function(array){
            _.each(array,function(element){
                console.log(element.data.StringValue,element.data._ref);
                
                that._allStateNames.push(element.data.StringValue);
                that._allStateRefs.push(element.data._ref);
                that._allowedAttributeValues.push(element);
                
            })
        });
       
       that._allStates = _.zip(that._allStateNames,  that._allStateRefs);

       
       
       
       console.log('_allowedAttributeValues',that._allowedAttributeValues);
       console.log('_allStates',that._allStates);
       that._allUniqueStateNames = _.uniq(that._allStateNames);
       console.log('_allUniqueStateNames',that._allUniqueStateNames);

    },  
    
    _addBoard: function(){
        var that = this;
        console.log('add board');
        var columns = [
            {
                value: null,
                columnHeaderConfig: {
                    headerData: {state: 'None'}
                }
            }
        ];
        
        _.each(that._allStates, function(record) {
            columns.push({
                value: record[1],
                columnHeaderConfig: {
                    headerData: {state: record[0]}
                }
            });
         });
        this.add({
            xtype: 'rallycardboard',
            types: ['PortfolioItem/Theme','PortfolioItem/Initiative','PortfolioItem/Feature'],
            attribute: 'State',
            context: this.getContext(),
            columnConfig: {
                columnHeaderConfig: {
                    headerTpl: '{state}'
                }
            },
            columns: columns 
        });
    }
   
});
