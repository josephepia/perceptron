import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import * as vis from "vis-network";
interface NodoArbol {
  name: string;
  children?: NodoArbol[];
};
@Component({
  selector: 'app-neurona',
  standalone: true,
  imports: [],
  templateUrl: './neurona.component.html',
  styleUrl: './neurona.component.scss'
})
export class NeuronaComponent implements OnInit,OnChanges{
  @Input() inputParameters:any;
  @ViewChild('arbol3', { static: true }) arbolRef3!: ElementRef;
  numIpunts = 3;
  numOutputs = 2;

  network!:vis.Network | null;
  
  
  ngOnInit(): void {
    

    if(this.inputParameters){
      this.drawing();
    }

  }
  
  ngOnChanges(){
    if(this.inputParameters){
      this.drawing();
    }
  }
  
  nodes:any[]= [];
  edges:any[] = [];
  
  drawing(){
  this.destroy();
  this.nodes = [];
  this.edges = [];
  let numInputs =  this.inputParameters.numInputs;
  let numOutputs = this.inputParameters.numOutputs;
  // let initialOutputs = 
  let initialActivation = numInputs+numOutputs;
  // let initialDesiredOutputs =
    // create an array with nodes
    
    // this.nodes[0]={id: 0, label: "X"+(0+1)};
    // this.nodes[0]['level'] = 0;
    
    // agregar nodo de entradas
    for (let i = 0; i < numInputs; i++) {
      this.nodes.push({id: i, label: "X"+(i+1)});
      this.nodes[i]['level'] = 0;
    }
    
    //agregar nodos de neuronas 
    for (let i = 0; i < numOutputs; i++) {
      this.nodes.push({id: numInputs+i, label: "∑"+(i+1)});
      this.nodes[numInputs+i]['level'] = 1;
      
    }
    
    //agregar nodo de activacion
    this.nodes[initialActivation]= {id: initialActivation, label: "si Xn >= 0 -> Y = 1\nsi Xn < 0 -> Y = 0"};
    this.nodes[initialActivation]['level'] = 2;
    this.nodes[initialActivation]['shape'] = 'box';
    this.nodes[initialActivation]['title'] = 'Funcion de activacion';
    
    //agregar nodos de las salidas 
    for (let i = 0; i < numOutputs; i++) {
      this.nodes[initialActivation+i+1]={id: initialActivation+i+1, label: "Y"+(i+1)};
      this.nodes[initialActivation+i+1]['level'] = 3;
      
    }
    
    
    
   
 
 //unir entradas a neuronas 
    for (let i = 0; i < numInputs; i++) {
      for (let j = 0; j < numOutputs; j++) {
        this.edges.push({from: i, to: numInputs+j, color: 'green', label: "W"+(i+1)+(j+1)});
        
      }  
    }
    
    //unir salidas a activacion --- unir activacion a saidas 
      for (let j = 0; j < numOutputs; j++) {
        this.edges.push({from: numInputs+j, to: initialActivation, label: "U"+(j+1)});
        this.edges.push({from: initialActivation, to: initialActivation+j+1});
        
      }  
    
   
    
    
    let data = { 
      nodes: this.nodes,
      edges: this.edges
    }
    
    let options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      edges: {
        smooth: {
          enabled: true,
          type: "cubicBezier",
          forceDirection: "horizontal",
          roundness: 0.6
        },
        arrows: {
          to: { enabled: true, scaleFactor: 1, type: 'arrow' },
          // from: true
          
        },
        arrowStrikethrough:true,
        endPointOffset:{
          from: 6,
          to: -0.9
        }
      },
      nodes: {
        shadow:{
          enabled: true,
          color: 'rgba(0,0,0,0.12)',
          size:16,
          x:0,
          y:4
        },
        color: {
          border: '#cccccc',
          background: '#cccccc',
          highlight: {
              border: '#cccccc',
              background: '#cccccc'
          },
          hover: {
              border: '#cccccc',
              background: '#cccccc'
          }
      },
      font: {
          color: 'white'
      }
      },
      layout: {
        randomSeed: undefined,
        improvedLayout: true,
        hierarchical: {
            enabled: true,
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'LR',        // UD, DU, LR, RL
            sortMethod: 'hubsize',   // hubsize, directed,
            // alignment: "center"
        }
    },
      // layout: {
      //   improvedLayout:true,
      //   hierarchical: {
      //     sortMethod: 'hubsize', 
      //     parentCentralization: true,
      //     direction: "LR",
      //     edgeMinimization: true,
      //     blockShifting: true,
      //     levelSeparation: 100,
          
      //   }
      // },
      interaction: {
        dragNodes: false,
        hideEdgesOnDrag: true,
        hover: true
      },
      physics: false
    };
    this.network = new vis.Network(this.arbolRef3.nativeElement, data,options);
    
    this.network.fit();
    let scala = this.network.getScale();
    let pos = this.network.getViewPosition();
    
    //evento al hacer zoom en el arbol, define el maximo zoom in y zoom out 
    this.network.on("zoom",()=>{
      
      
      
      // maxima escala de zoom out => alejar
      if(this.network!.getScale() < scala )
      {
        // impidiendo un zoom elevado
       this.network!.moveTo({
           position: {x:pos.x, y:pos.y},
           scale: scala,
         });
      }
    });
    
  }
  
  destroy() {
    if (this.network !== null || this.network !== undefined) {
      this.network?.destroy();
      this.network = null;
    }
  }
  
}
