###
Copyright 2014 Clemens Nylandsted Klokmose, Aarhus University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
###

$(document).ready () =>
    sharejsDoc = window.location.pathname[1..window.location.pathname.length]
    document.title = "Webstrate - " + sharejsDoc
    if sharejsDoc.length == 0
        throw "Error: No document id provided"
    wshost = 'ws://' + window.location.host + '/ws/'
    ws = new ReconnectingWebSocket wshost
    window._sjs = new sharejs.Connection ws
    
    doc = _sjs.get 'webstrates', sharejsDoc 
    
    doc.subscribe()
    $(document).empty()
    doc.whenReady () ->
        window.dom2shareInstance = new DOM2Share doc, document, () ->
            event = new CustomEvent "loaded", { "detail": "The share.js document has finished loading" }
            document.dispatchEvent event
            parent.postMessage "loaded", '*' #Tell the outer window that loading is finished (e.g. if embedded in an iFrame)