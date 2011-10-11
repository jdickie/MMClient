Interedition MM Client
======================

Authors: Grant Dickie
		
Development Notes
-------

FRONT END CLIENT GROUP
	- Display Text from corpora
	- Allow user to select the text (Creates a target object)
	- Allow user to enter text to Body content as free text
	- Push annotation to raxdl server
	- TODO: register constraints on constraint server 

	Use cases for front-end client:
	* User has Target URI of <mime-type> (XML, text, website, image) that they provide text in a textarea to describe/annotate
		- Grab the URI of the target item, validate, display success message to user
		- Ingest textarea data and create a new Body URI and record in the backend service
		- update data store and presentations to reflect this
	* User gives a Target URI <mime-type> ... and a URI for the Body that points to anything but another annotation
		- Checks the URI of that is input for Body, validates, and display success message to user
		- Checks the data store/server to see if there is a record already present of the Body URI, if there is, pulls data into Data Store. If not, data store creates a new URI for the Body and record. Pushes to server.
		
	Assumptions for Client: 
		- Each annotation is different (Differentiate using timestamp)
