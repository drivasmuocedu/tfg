import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import axios from 'axios';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { MatDialog } from '@angular/material/dialog';
import ImageLayer from 'ol/layer/Image';
import { ImageWMS } from 'ol/source';
import { MapService } from 'src/app/services/map.service';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import Layer from 'ol/layer/Layer';
import { ProjectService } from 'src/app/services/project.service';
import LayerGroup from 'ol/layer/Group';
import { Collection, View } from 'ol';
import * as olProj from 'ol/proj';
import * as olExtent from 'ol/extent';
import { BrowserLayerGroup, BrowserLayer } from 'src/app/models/browser.model';
import { BrowserService } from 'src/app/services/browser.service';
import { MatSliderChange } from '@angular/material/slider';
import VectorLayer from 'ol/layer/Vector';

export class FileNode {
  id!: string;
  children!: FileNode[];
  filename!: string;
  type: any;
  layer!: Layer | undefined;
  leyend!: string | undefined;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean,
    public filename: string,
    public level: number,
    public type: any,
    public id: string,
    public layer: Layer | undefined,
    public leyend: string |undefined
  ) {}
}

let TREE_DATA = JSON.stringify({
  Capa_1: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app'
  },
  Capa_2: {
    angular: 'tt' ,
    material2: 'ii'
  },
  Capa_3: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html'
  },
  Capa_4: {
    Sun: 'png',
    Woods: 'jpg'
  }
});

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    //this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0,undefined,[]);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number, parentId: string = '0',layers: any): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key, idx) => {
      const value = obj[key];
      let layer;
      if (value === '') {
        const layerGroups = layers.filter((layer:any) => layer.layer instanceof LayerGroup)
        layerGroups.forEach((lg:any) => {
          layer = lg.layers.find((l:any) =>l.name === key);
        })
      } else {
        layer = layers.find((layer:any) =>layer.name === key)
      }
      
      const node = new FileNode();
      node.filename = key;
      node.layer = layer?.layer;
      if (node.layer instanceof LayerGroup) {
       
       // node.layer.children.forEach((child: any) => {
         // child.leyend = child.layer?.layer.getSource().getLegendUrl();
       // })
      } else {
        //node.leyend = layer?.layer.getSource().getLegendUrl();
      }
      //node.leyend = layer?.layer.getSource().getLegendUrl();
      /**
       * Make sure your node has an id so we can properly rearrange the tree during drag'n'drop.
       * By passing parentId to buildFileTree, it constructs a path of indexes which make
       * it possible find the exact sub-array that the node was grabbed from when dropped.
       */
      node.id = `${parentId}/${idx}`;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1, node.id, layers);
          node.children.forEach((child: any) => {
            child.leyend = child.layer?.getSource().getLegendUrl();
           })
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-layer-list',
  templateUrl: './layer-list.component.html',
  styleUrls: ['./layer-list.component.scss'],
  providers: [FileDatabase]
})
export class LayerListComponent implements OnInit {
  @Output()
  close = new EventEmitter();
  mylayerlist: any[] = [];
  //dataSource: MatTreeNestedDataSource<any>;
  //treeControl: NestedTreeControl<any>;
  selectedLayer?: any;
  selectedLayers?: any[] = [];
  selectedLayerGroups?: any[] = [];
  selectedTree: any[] = [];

  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<string>(true);
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  validateDrop = true;

  allPartes = true;

  isNestedParentNode = (_: number, node: any) => {
    return node.parent && node.children.length > 0;
  };

  isRootNode = (_: number, node: any) => {
    return node.layers === undefined;
  };

  constructor(private mapService: MapService,
     public dialog: MatDialog,
     private database: FileDatabase,
     private projectService: ProjectService,
     private browserService: BrowserService,) { 

      this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
        this._isExpandable, this._getChildren);
      this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
      database.dataChange.subscribe(data => this.rebuildTreeForData(data));
     }

  ngOnInit(): void {

    if (this.projectService.selectedlayers?.length > 0 || this.projectService.selectedLayerGroups?.length > 0)
    this.loadLayerTree();

  
  }


  loadLayerTree() {
    this.selectedLayers = [...this.projectService.selectedlayers];
    this.selectedLayerGroups = [...this.projectService.selectedLayerGroups];

    this.selectedTree = this.selectedLayers.concat(this.selectedLayerGroups);
    console.log(this.selectedTree)
    this.dataSource.data = this.selectedTree;
    this.treeControl.dataNodes = this.selectedTree
    let dataObject: any = {} 
    //this.selectedLayers.forEach(selectedLayer => {
      //dataObject[selectedLayer.name] = {};
   //})
   this.selectedTree.slice().reverse().forEach(selected => {
    if(selected.layers?.length > 0){
      let layers:any = {}
      selected.layers.forEach((layer:any) => {
        layers[layer.name] = ''
      })
      dataObject[selected.name] = layers;
    } else {
      dataObject[selected.name] = {};
    }
   })


    /*
    const dataObject = {
      Applications: {
        Calendar: 'app',
        Chrome: 'app',
        Webstorm: 'app'
      },
      Documents: {
        angular: {
          src: {
            compiler: 'ts',
            core: 'ts'
          }
        }}}*/
    const data = this.database.buildFileTree(dataObject, 0, undefined, this.selectedTree);

      // Notify the change.
      this.database.dataChange.next(data);
  }

  onVisibilityClick(item: FileFlatNode) {
    item.layer?.setVisible(!item.layer.getVisible())
  }

  onZoomClick(layer: ImageLayer<any> | LayerGroup){

  }

  onZoomVisibleClick(layer:any){

  }

  onShowPropertiesClick(layer:any){

  }

  onRemoveLayerClick(nodo: any){
    this.mapService.map.removeLayer(nodo.layer)
    let layerLoadedInTree: BrowserLayer | undefined = this.browserService.browserLayers.find(layerInService => nodo.filename === layerInService.name);
    let layerGroupLoadedInTree: BrowserLayer | undefined = this.browserService.browserLayerGroups.find(layerGroupInService => nodo.filename === layerGroupInService.name);

    if (nodo.layer instanceof ImageLayer) {
      this.projectService.selectedlayers = this.projectService.selectedlayers.filter((ly: BrowserLayer) => ly.name !== nodo.layer.get('name'));
    } else if (nodo.layer instanceof LayerGroup) {
      this.projectService.selectedLayerGroups = this.projectService.selectedLayerGroups.filter((lygroup: BrowserLayerGroup) => lygroup.name !== nodo.layer.get('name'));
    }

    if (layerLoadedInTree) {
      layerLoadedInTree.loaded = false;
    }
    if (layerGroupLoadedInTree) {
      layerGroupLoadedInTree.loaded = false;
    }
    let changedData = this.dataSource.data.filter((node: FileNode) => node.filename !== nodo.layer.get('name'));
    this.rebuildTreeForData(changedData);
  }

  isLayerGroup(node: FileFlatNode) {
    if(node.layer instanceof LayerGroup) {
      return true;
    } else {
      return false;
    }
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type, node.id, node.layer, node.leyend );
  }
  private _getLevel = (node: FileFlatNode) => node.level;
  private _isExpandable = (node: FileFlatNode) => node.expandable;
  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

  // DRAG AND DROP METHODS

  shouldValidate(event: MatCheckboxChange): void {
    this.validateDrop = event.checked;
  }

  /**
   * This constructs an array of nodes that matches the DOM
   */
  visibleNodes(): FileNode[] {
    const result: any[] = [];

    function addExpandedChildren(node: FileNode, expanded: string[]) {
      result.push(node);
      if (expanded.includes(node.id)) {
        node.children.map((child) => addExpandedChildren(child, expanded));
      }
    }
    this.dataSource.data.forEach((node) => {
      addExpandedChildren(node, this.expansionModel.selected);
    });
    return result;
  }

  /**
   * Handle the drop - here we rearrange the data based on the drop event,
   * then rebuild the tree.
   * */
  drop(event: CdkDragDrop<string[]>) {
    // console.log('origin/destination', event.previousIndex, event.currentIndex);
    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) return;

    // construct a list of visible nodes, this will match the DOM.
    // the cdkDragDrop event.currentIndex jives with visible nodes.
    // it calls rememberExpandedTreeNodes to persist expand state
    const visibleNodes = this.visibleNodes();

    //la Layer no lo puede serializar
    //se borra, se clona y luego se rrecupera
    this.dataSource.data.forEach((node: FileNode) => {
      if (node.children?.length > 0) {
        node.layer = undefined;
        node.children.forEach((child: FileNode) => {
            child.layer = undefined;
         })
      } else {
        node.layer = undefined;
      }
      });

    // deep clone the data source so we can mutate it
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

    changedData.forEach((node: any) => {
      
      if (node.children?.length > 0) {
        const layergroup = this.selectedLayerGroups?.filter((layergroup:any) =>layergroup.name === node.filename)
        if(layergroup)
        node.layer = layergroup[0].layer;
        if (layergroup && layergroup?.length > 0) {
          
          layergroup[0].layers?.forEach((nodeLayerGroupLayers: any) => {
            node.children.forEach((l: any) => {
              //const layerOfLayerGroup = this.selectedLayers?.find((layer:any) =>layer.name === nodeLayerGroupLayers.name)
              if (l.filename === nodeLayerGroupLayers.name) {
                
                l.layer = nodeLayerGroupLayers.layer;
              }
            })
          })
        }       
      } else {
        const layer = this.selectedLayers?.find((layer:any) =>layer.name === node.filename)
        node.layer = layer.layer;
      }
      });

      this.dataSource.data.forEach((node: FileNode) => {
        if (node.children?.length > 0) { 
          const layergroup = this.selectedLayerGroups?.filter((layergroup:any) =>layergroup.name === node.filename)
          if (layergroup && layergroup?.length > 0) {       
              layergroup[0].layers?.forEach((nodeLayerGroupLayers: any) => {
                node.children.forEach((l: any) => {
                  if (l.filename === nodeLayerGroupLayers.name) {  
                    l.layer = nodeLayerGroupLayers.layer;
                  }
                })
              })
              } 
        } else {
          const layer = this.selectedLayers?.find((layer:any) =>layer.name === node.filename)
          node.layer = layer.layer;
        }

        
        });
  

    // recursive find function to find siblings of node
    function findNodeSiblings(arr: Array<any>, id: string): Array<any> {
      let result, subResult;
      arr.forEach((item, i) => {
        if (item.id === id) {
          result = arr;
        } else if (item.children) {
          subResult = findNodeSiblings(item.children, id);
          if (subResult) result = subResult;
        }
      });
      return result as any;

    }

    // determine where to insert the node
    const nodeAtDest = visibleNodes[event.currentIndex];
    const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
    if (!newSiblings) return;
    const insertIndex = newSiblings.findIndex(s => s.id === nodeAtDest.id);

    // remove the node from its old place
    const node = event.item.data;
    const siblings = findNodeSiblings(changedData, node.id);
    const siblingIndex = siblings.findIndex(n => n.id === node.id);
    const parent = this.getParentNode(node);
    const nodeToInsert: FileNode = siblings.splice(siblingIndex, 1)[0];
    if (nodeAtDest.id === nodeToInsert.id) return;

    // ensure validity of drop - must be same level
    const nodeAtDestFlatNode = this.treeControl.dataNodes.find((n) => nodeAtDest.id === n.id);
    if (this.validateDrop && nodeAtDestFlatNode?.level !== node.level) {
      //alert('Items can only be moved within the same level.');
      return;
    }
    // insert node 
    newSiblings.splice(insertIndex, 0, nodeToInsert);
    // rebuild tree with mutated data
    this.rebuildTreeForData(changedData);

    const collection = this.mapService.map.getLayers();
    const layers = collection.getArray();
    // Switch layers
    let found = false;
    for (var i = 1; i < layers.length; i++) {
      if (found) {
        break;
      }
      if (event.item.data.level === 1) {
        if(parent && parent.layer instanceof LayerGroup) {
          const layersFromLayerGroup = parent.layer.getLayers();
          const layersFromLayerGroupArr = layersFromLayerGroup.getArray() as any[];
          for (var j = 0; j < layersFromLayerGroupArr.length; j++) { 
            if (layersFromLayerGroupArr[j].getSource()['params_']['LAYERS'] === event.item.data.layer.getSource()['params_']['LAYERS']) {
              let lengthArr = Array.from({length: layersFromLayerGroupArr.length}, (_, i) => i)
              const idx = lengthArr.indexOf(event.previousIndex - 1)           
              const reverse: number = lengthArr.reverse().at(idx) as number
              let layerRemoved = layersFromLayerGroup.removeAt(reverse) 
              if (layerRemoved ) {
                const idx = lengthArr.indexOf(event.currentIndex - 1)           
                const reverse: number = lengthArr.reverse().at(idx) as number
                layersFromLayerGroup.insertAt(reverse, layerRemoved )
              }
              //const news = layersFromLayerGroup.getArray();
              //const newCollection = new Collection(news)
              //parent.layer.
              //if(newCollection)
              //parent.layer.setLayers(layersFromLayerGroup)
              found = true;
              break
            }
          }

        }
        
      }

      if (layers[i] == event.item.data.layer) {
        let lengthArr = Array.from({length: layers.length - 1}, (_, i) => i + 1)
        const idx = lengthArr.indexOf(event.currentIndex + 1)
        const reverse: number = lengthArr.reverse().at(idx) as number
        collection.removeAt(i)
        //console.log(event.currentIndex + 1)
        collection.insertAt(reverse, event.item.data.layer)
        break
      }
    }
    

  
    /*
    for (var j = 0; j < layers.length; j++) {
      if (layers[j] === target) {
        if (i > j)
          collection.insertAt(j, event.item.data.layer)
        else
          collection.insertAt(j + 1, event.item.data.layer)
        break
      }
    }
    */
    
  }

  /**
   * Experimental - opening tree nodes as you drag over them
   */
  dragStart() {
    this.dragging = true;
  }
  dragEnd() {
    this.dragging = false;
  }
  dragHover(node: FileFlatNode) {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }
  dragHoverEnd() {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
    }
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

  rebuildTreeForData(data: any) {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id) => {
        const node = this.treeControl.dataNodes.find((n) => n.id === id);
        this.treeControl.expand(node as any);
      });
  }

  /**
   * Not used but you might need this to programmatically expand nodes
   * to reveal a particular node
   */
  private expandNodesById(flatNodes: FileFlatNode[], ids: string[]) {
    if (!flatNodes || flatNodes.length === 0) return;
    const idSet = new Set(ids);
    return flatNodes.forEach((node) => {
      if (idSet.has(node.id)) {
        this.treeControl.expand(node);
        let parent = this.getParentNode(node);
        while (parent) {
          this.treeControl.expand(parent);
          parent = this.getParentNode(parent);
        }
      }
    });
  }

  private getParentNode(node: FileFlatNode): FileFlatNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


  onLayerOpacityChange(event: MatSliderChange, layer: VectorLayer<any>) {
    layer.setOpacity(event.value || 0);
  }

  onCloseClick() {
    this.close.emit();
  }
}
