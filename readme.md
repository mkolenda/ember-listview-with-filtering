# ember-listview-with-filtering

I was asked to create an Ember app that displays a large number of models, within each model there a even more 
related objects.  This made for a pretty slow load time as the browser chugged along creating thousands of DOM objects.
Additionally, the app needed to filter the models based on use entered
text.  Thankfully there is an Ember AddOn called ListView that handles creating and destroying DOM objects
as they become visible and hidden on the page from user scrolling.  Using this AddOn reduces initial DOM load time by a lot.  Good news!
The Ember.ListView class is a descendant of Ember.CollectionView. 

One challenge I had is that it is not trivial to set filtered content for an Ember.ListView.  The 
examples on the ListView site and others I found on the web show how to use ListView with static content.  There was one
that showed how to associate filtered content with a CollectionView.  Unfortunately
when using the approach in that suggestion the controller that is normally associated with the template rendered by the itemViewClass property 
is over-ridden by the content returned by the filter.  I had a need to bind a controller and model to the template identified
in itemViewClass.

After some hacking and asking those who know more than me I came up with this solution.  This example shows how to use
ItemView. 

Useful links:
* My ask to the universe: http://stackoverflow.com/questions/27463781/why-is-itemcontroller-not-set-in-the-child-view
* Filtering Content on a CollectionView: http://jsbin.com/kujim/4/edit?html,css,js,output
* Accessing a parent within a nested each loop: http://stackoverflow.com/questions/22018476/emberjs-accessing-a-parent-inside-each-loop
* Binding a controller to a child view of a CollectionView: http://stackoverflow.com/questions/15983217/binding-collectionview-to-an-arraycontroller
* Ember filtering basics: http://blog.crowdint.com/2014/07/08/simple-collection-s-sorting-and-filtering-with-ember-js.html
* Ember list-view Github: https://github.com/emberjs/list-view
* Ember list-view how to: http://emberjs.com/list-view/

## How to run
* Clone the repo
* Configure your webserver to serve the site
* go to <whatever you named the site>/#/data/index
