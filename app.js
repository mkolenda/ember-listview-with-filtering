App = Ember.Application.create();

App.Router.map(function() {
    this.resource("data", function() { // Need a data template to display the search textbox and the {{outlet for the index}}
                                       // dataController is like the doctorsController
                                       // data template is like doctors.hbs
        this.route("index");           // dataIndex Controller is like doctor controller
                                       // /#/data/index
    });
                                        // I'm leaving these routes broken for now.
                                        // All I care about is that I can generate the correct URL with the link-to

});

App.DataIndexRoute = Ember.Route.extend({
    model: function() {                // set the model on the dataIndex controller
        var ret = [];
        for(i=0; i < 10000; i++) {
            var obj = Ember.Object.create({id: i, name: 'row ' + i});
            ret[i] = obj;
        }
        return(ret);
    },

    setupController: function(controller, model) {
        this._super(controller, model);  // call super to the content is set on the controller
        this.controllerFor('dataIndex').set('originalContent', model);
                                         // HACK! In order to preserve the content after the filter we need to put it somewhere
    }
});

App.DataController = Ember.ArrayController.extend({
    filter: ''                           // Holds the text entered in the filter field
});

App.DataIndexController = Ember.ArrayController.extend({
    needs: ['data'],                    // needs access to the filter property
    originalContent: [],                // This is set to the content retrieved by the route

    itemController: 'row',              // Sets the controller to be used by the App.DataIndexView.itemViewClass
                                        // 'row' = App.RowController

    filter: Ember.computed.alias("controllers.data.filter"),
                                        // Get a reference to the IndexController.filter property

    filteredContent: function(){        // Do the filtering and set the content property of this controller
                                        // with the filtered content.  Have to do this for the RowView to
                                        // update with the filtered rows.  Which is a HACK!
        Ember.run.debounce(this, this.runFilter, 250);
                                        // debounce the function because this filter is SLOWWWWWW!
    }.observes('filter'),               // This is observes, not a property.  It sets the content property

    runFilter: function() {
        var filter = this.get('filter');
        var list = this.get('originalContent');

        var filtered = list.filter(function(item) {
            return item.get('name').match(filter);
        });

        this.set('content', filtered)
    }

});


App.RowController = Ember.ObjectController.extend({

    getName: function() {               // Retrieve this property whenever you want to ensure that the right model
                                        // is bound to the controller.
        return(this.get('content').get('name'));
    }.property(),

    matt: function() {                  // A dummy method to call whenever you want to make sure the right controller
                                        // is in context
        return('Matt');
    }.property(),

    at_most_times: function() {         // This is a similar method to DoctorController.at_most_times.
                                        // The doctor_details.hbs template calls this method in an #each bock
                                        // it also calls #each on the nested elements within the times array
        return([
            Ember.Object.create({address:'100 Main St', times: [{appointmentid: '100', time: '10 AM'}, {appointmentid: '110', time: '11 AM'}]}),
            Ember.Object.create({address:'200 McKenzie St', times: [{appointmentid: '200', time: '12 AM'}, {appointmentid: '210', time: '13 AM'}]}),
            Ember.Object.create({address:'300 Pasadena Blvd', times: [{appointmentid: '300', time: '14 AM'}, {appointmentid: '310', time: '15 AM'}]})
        ])
    }.property(),

    arrayContent: function(){           // HACK! The doctor_details.hbs template uses an #each block to preserve
                                        // the doctor model for use in subsequent each and helper method calls.
                                        // Since we are using a CollectionView to render rows and not #each
                                        // We need a way to force the content into an array and loop through the single
                                        // element arry in the view.  This controller method does the job.  But it sucks.
        return([this.get('content')])
    }.property('content')
});


App.DataIndexView = Ember.ListView.extend({
                                        // We are forced to use a collectionView instead of #each in the data view
                                        // because the ItemView library descends from collectionView
    tagName: 'ul',
    contentBinding: 'controller',       // I got the most inspiration from these two JSBins:
                                        // http://jsbin.com/kujim/4/edit?html,css,js,output
                                        //  - Shows how to use a property for the content of a itemViewClass
                                        // http://jsbin.com/rujixexege/1/edit
                                        //  - Shows how to pass a controller and content to the view in itemViewClass
    height: 800,
    rowHeight: 250,
    classNames: ['parent-view'],
//    this worked without the contentBinding above, except the itemController did not set the controller for the row views
//    content: function(){
//        return this.get('controller.filteredContent')
//    }.property('controller.filteredContent'),

    itemViewClass: 'row'                // This is equivalent to the doctor-details view/template
});

App.RowView = Ember.ListItemView.extend({
    controllerBinding: 'content',
    templateName: 'row',
    classNames: ['row-class'],


    didInsertElement: function(){       // Making sure that we can call JS the same way we do in the doctor-details view
        this.$().hover(
            function() {
                $(this).parent().addClass("appointment-hover");
                                        // Using parent() here to get the ul of this li.
                                        // Idea is the same as what we do in FAD
                $(this).addClass("doctor-hover");
            },
            function() {
                $(this).parent().removeClass("appointment-hover");
                $(this).removeClass("doctor-hover");
            }
        );
    },
    actions: {
        set: function() {   // I had to include target="view" on the handlebars action call.
            this.$().addClass('set')
        }
    }
});

App.TimeSummaryView = Ember.View.extend({
                                        // This is the same view as time-summary view in FAD
    templateName: "time-summary",
    classNames: ["block3"]
});


App.AppointmentItemView =  Ember.View.extend({
                                        // This is the same as appointment-item view in FAD
    tagName: 'li',
    classNames: ['appointment-list'],

    didInsertElement: function() {
        this.$().hover(
            function() {
                $(this).addClass("appointment-item-hover");
            },
            function () {
                $(this).removeClass("appointment-item-hover");
            }
        );
    }
});


App.TellMeHelper = Ember.Handlebars.makeBoundHelper(function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});
