
<template>
    <div id="grid">
        <div id="header">
            <div style="grid-column: 60 / span 60;" id="h7" @dragover.prevent @drop="drop($event)">7</div>
            <div style="grid-column: 120 / span 60;" id="h8" @dragover.prevent @drop="drop($event)">8</div>
            <div style="grid-column: 180 / span 60;" id="h9" @dragover.prevent @drop="drop($event)">9</div>
            <div style="grid-column: 240 / span 60;" id="h10" @dragover.prevent @drop="drop($event)">10</div>
            <div style="grid-column: 300 / span 60;" id="h11" @dragover.prevent @drop="drop($event)">11</div>
            <div style="grid-column: 360 / span 60;" id="h12" @dragover.prevent @drop="drop($event)">12</div>
            <div style="grid-column: 420 / span 60;" id="h13" @dragover.prevent @drop="drop($event)">13</div>
            <div style="grid-column: 480 / span 60;" id="h14" @dragover.prevent @drop="drop($event)">14</div>
            <div style="grid-column: 540 / span 60;" id="h15" @dragover.prevent @drop="drop($event)">15</div>
            <div style="grid-column: 600 / span 60;" id="h16" @dragover.prevent @drop="drop($event)">16</div>
            <div style="grid-column: 660 / span 60;" id="h17" @dragover.prevent @drop="drop($event)">17</div>
            <div style="grid-column: 720 / span 60;" id="h18" @dragover.prevent @drop="drop($event)">18</div>
            <div style="grid-column: 780 / span 60;" id="h19" @dragover.prevent @drop="drop($event)" >19</div>
            <div style="grid-column: 524 / span 60;" id="lesson" draggable="true" @dragstart="saveDraggedId($event)">lesson</div>
            <div style="grid-column: 594 / span 60;" id="meth" draggable="true" @dragstart="saveDraggedId($event)">Meth</div>
        </div>
    </div>
        <div id="app">
        <div id="drag" draggable="true" @dragstart="saveDraggedId($event)" >Drag this...</div>
    <br />
        <div @dragover.prevent @drop="drop($event)" id="drop">drop here...</div>
    </div>
</template>
<script setup>

let lastDraggedId = "nothingSaved";

function saveDraggedId(event){
    lastDraggedId = event.target.id;
}

function drop(event) {
    let dropPosition = document.getElementById(event.target.id).style.gridColumnStart; 
    //alert("Moved ".concat(lastDraggedId, " to ", event.target.id, " on ", dropPosition.toString()));
    document.getElementById(lastDraggedId).style.gridColumnStart = dropPosition; 
}


</script>



<style scoped>
    #grid {
        width: 1000px;
    }
    #grid > * {
        display: grid;
        gap: 0;
        grid-auto-columns: 1px;
        grid-auto-rows: 80px;
    }
    #grid > * > * {
        border: 1px solid black;
        grid-row-end: span 1;
        background: brown;
    }
    #header > * {
        grid-row-start: 1;
    }
    #lesson {
        background: rgb(115, 115, 136);
    }
    #meth {
        background: pink;
    
    }
    
    </style>