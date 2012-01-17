/*
* MM Client Front-End
* 
* @author: Grant Dickie
* 
* Uses MITHGrid - (c) 2011 MITH
* 
* This is a MITHGrid application of the OAC Annotation Repository framework produced by Asaf Bartov, Moritz Wissenbach,
* Marco Petris, and fellow from the University of Madrid. The server stores annotations and allows for querying across
* the already stored annotations with REST calls. Each Annotation, Body, and Target are given REST paths once stored
* at the server level. They can be retrieved using these calls. Note: the Ruby server returns a status of 302 when an
* annotation is successfully stored.
* 
* Locally, all annotations for a particular target are stored in the MITHGrid datastore. When a user enters a new 
* Target path, the annotations for that Target are automatically queried and retrived from the server via REST and
* put into the local data store in order to be queried against locally and provide faster service. Further use cases
* should be considered, where a user wants to query against more than just annotations on a the given Target.  
*
* Currently this is being only implemented to handle registration of a particular annotation to the server. 
*  
*/

var MITHGrid = MITHGrid || {};
var jQuery = jQuery || {};
var Interedition = Interedition || {};
var app = app || {};
var rangy = rangy || {};

MITHGrid.globalNamespace('Interedition');
Interedition.namespace('Client');
Interedition.Client.namespace('AnnotationRegistration');
