import { Component, OnInit } from '@angular/core';
import { getTopLeft, getWidth } from 'ol/extent';
import { get } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { ImageWMS, OSM, TileWMS, WMTS, XYZ } from 'ol/source';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { WMSCapabilities, WMTSCapabilities } from 'ol/format';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import axios from 'axios';
import ImageLayer from 'ol/layer/Image';

@Component({
  selector: 'app-baselayers',
  templateUrl: './baselayers.component.html',
  styleUrls: ['./baselayers.component.scss']
})
export class BaselayersComponent implements OnInit {
  bsmSelected = 'arabaBasico';
  bsSubscription!: Subscription;
  constructor(private mapService: MapService) { }

  async ngOnInit(): Promise<void> {
    let osm = new TileLayer({
      source: new OSM(),
      visible:true,
    })
    osm.set('name','osm');
    this.mapService.map.addLayer(osm);

    const NDVIchangeUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/b46cf5a8710c8a1f959c4af3fe1d69ba-7eb9de7d671f95f8682dc50bd95f724e/tiles/{z}/{x}/{y}"

    // Capa de Google Earth Engine
    const NDVIchangeLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: NDVIchangeUrl,
      }),
    });
    NDVIchangeLayer.set('name','NDVIchange');
    this.mapService.map.addLayer(NDVIchangeLayer);

    const NDVIchangeSigUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/1f273afea120c55964b8f8e8aefcd023-ac10b54bb32d72f18aafae2d89e6ef48/tiles/{z}/{x}/{y}"

    // Capa de Google Earth Engine
    const NDVIchangeSigLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: NDVIchangeSigUrl,
      }),
    });
    NDVIchangeSigLayer.set('name','NDVISigchange');
    this.mapService.map.addLayer(NDVIchangeSigLayer);



    const VV_2020Url = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/5b03419ea3edbb195b9bc8ede507fef0-f8c62cc64feb2bccda5dd696fc90b7e1/tiles/{z}/{x}/{y}"
    const VV_2020Layer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: VV_2020Url,
      }),
    });
    VV_2020Layer.set('name','VV_2020');
    this.mapService.map.addLayer(VV_2020Layer);

    const VH_2020Url = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/804606bbd2274d2707419be2ad54d23a-a553b0a4bb5731ec726f03886ee9aa42/tiles/{z}/{x}/{y}"
    const VH_2020Layer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: VH_2020Url,
      }),
    });
    VH_2020Layer.set('name','VH_2020');
    this.mapService.map.addLayer(VH_2020Layer);

    const VH_ChangeUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/f99c1ac9c5d0759f390d48f57309ef7d-24c3aa259cd1c582b7d567c5f22efd0e/tiles/{z}/{x}/{y}"
    const VH_ChangeLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: VH_ChangeUrl,
      }),
    });
    VH_ChangeLayer.set('name','VH_Change');
    this.mapService.map.addLayer(VH_ChangeLayer);

    const VV_ChangeUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/cd9521f044e10c61a21419e52c5cd835-d94941b6caebff4396458f1bac4e1670/tiles/{z}/{x}/{y}"
    const VV_ChangeLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: VV_ChangeUrl,
      }),
    });
    VV_ChangeLayer.set('name','VV_Change');
    this.mapService.map.addLayer(VV_ChangeLayer);

    const VV_SigChangeUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/7ba49ccb122e8884cde4bd462a916439-dfba3405490ecc8ec4370e64c558a9e4/tiles/{z}/{x}/{y}"
    const VV_SigChangeLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: VV_SigChangeUrl,
      }),
    });
    VV_SigChangeLayer.set('name','VV_SigChange');
    this.mapService.map.addLayer(VV_SigChangeLayer);

    const VH_SigChangeUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/cd9521f044e10c61a21419e52c5cd835-d94941b6caebff4396458f1bac4e1670/tiles/{z}/{x}/{y}"
    const VH_SigChangeLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: VH_SigChangeUrl,
      }),
    });
    VH_SigChangeLayer.set('name','VH_SigChange');
    this.mapService.map.addLayer(VH_SigChangeLayer);

    const CombChangeUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/abf4a61eac8de3cee7157235b7d652f2-49560d11bac9c53e493ef6330bb30a6e/tiles/{z}/{x}/{y}"
    const CombChangeLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: CombChangeUrl,
      }),
    });
    CombChangeLayer.set('name','CombChange');
    this.mapService.map.addLayer(CombChangeLayer);

    const change2024Url = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/598bb24fd3e80f53c2c235bb06b4dc81-0ca0e05b1c03ab9636691b15bec62811/tiles/{z}/{x}/{y}"
    const change2024Layer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: change2024Url,
      }),
    });
    change2024Layer.set('name','change2024');
    this.mapService.map.addLayer(change2024Layer);

    /*
    const ValidChangeUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/3073565a66f089c59a39418ff13d999e-4cf1a4af815754f13bfddf531916a64e/tiles/{z}/{x}/{y}"
    const ValidChangeLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: ValidChangeUrl,
      }),
    });
    ValidChangeLayer.set('name','ValidChange');
    this.mapService.map.addLayer(ValidChangeLayer);
    */

    let esriImagery = new TileLayer({
      visible:false,
      source: new XYZ({
      url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      })
    })
    esriImagery.set('name','esriImagery');
    this.mapService.map.addLayer(esriImagery);

    const cacaoUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/e710bc19faaf08d0c5453cf7131d9991-8b55ecb79e580d050efc468aaf92bf8f/tiles/{z}/{x}/{y}"
    const cacaoLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: cacaoUrl,
      }),
    });
    cacaoLayer.set('name','cacao');
    this.mapService.map.addLayer(cacaoLayer);

    const defocacaoUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/7c529895a3647a2fb832e65babf61ab8-d9ef51acf79b2794a9fb1bad75396e3b/tiles/{z}/{x}/{y}"
    const defocacaoLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: defocacaoUrl,
      }),
    });
    defocacaoLayer.set('name','defocacao');
    this.mapService.map.addLayer(defocacaoLayer);
    

    const landuseUrl = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/7e64a8efd070a797226e508d0b145fca-d8a47cf40c1b46ec2f1454a757dee673/tiles/{z}/{x}/{y}"
    // Capa de Google Earth Engine
    const landuseLayer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: landuseUrl,
      }),
    });
    landuseLayer.set('name','landuse');
    this.mapService.map.addLayer(landuseLayer);


    const orto2020Url = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/3777e029a45c4e909a62a40df4236209-c0eee6be16ec61dd0a5284c7eae7c64e/tiles/{z}/{x}/{y}"
   

    const orto2020Layer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: orto2020Url,
      }),
    });
    orto2020Layer.set('name','orto2020');
    this.mapService.map.addLayer(orto2020Layer);

    const orto2021Url = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/b7284706bc51f0650a06e9d03d3bc337-19f802cab0e86346b7227f509f7af9db/tiles/{z}/{x}/{y}"

    const orto2021Layer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: orto2021Url,
      }),
    });
    orto2021Layer.set('name','orto2021');
    this.mapService.map.addLayer(orto2021Layer);

    const orto2024Url = "https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/c043eb832a23a269dd488ec974332ca6-91a48ea4d3426ee30df3381027798526/tiles/{z}/{x}/{y}"

    const orto2024Layer = new TileLayer({
      visible:false,
      source: new XYZ({
        url: orto2024Url,
      }),
    });
    orto2024Layer.set('name','orto2024');
    this.mapService.map.addLayer(orto2024Layer);

    const urlOrtofotoReciente = `https://www.geo.euskadi.eus/WMS_ORTOARGAZKIAK`
    await axios.get(`${urlOrtofotoReciente}?lang=en&service=WMS&version=1.3.0&request=GetCapabilities`).then((response) => {
      var result = new WMSCapabilities().read(response.data);
      let extent3857;
      if (result['Capability']['Layer']['BoundingBox']?.length > 0) {
        extent3857 = result['Capability']['Layer']['BoundingBox'][3]['extent']
      }

      let ortofotoReciente = new TileLayer({
        //extent: extent3857,
        visible:false,
        source: new TileWMS({
          url: `https://www.geo.euskadi.eus/WMS_ORTOARGAZKIAK`,
          params: {'LAYERS': 'ORTO_EGUNERATUENA_MAS_ACTUALIZADA', 'TILED': true},
          crossOrigin: 'anonymous'

        })
    })
    //ortofotoReciente.set('name','ortofotoReciente');
    //this.mapService.map.addLayer(ortofotoReciente);
  })


    const url = `https://geo.araba.eus/wmts/1.0.0/WMTS_OinarrizkoMapak.xml`
    await axios.get(`${url}?lang=en&service=WMTS&version=1.3.0&request=GetCapabilities`).then((response) => {
      var result = new WMTSCapabilities().read(response.data);
      const optionsArabaBasico: any = optionsFromCapabilities(result, {
        layer: 'OGC_ARABA_WMTS_Oinarrizkoa',
        matrixSet: 'EPSG:3857',
        crossOrigin: 'anonymous'
      });

      const optionsArabaTopografico: any = optionsFromCapabilities(result, {
        layer: 'OGC_ARABA_WMTS_Topografikoa',
        matrixSet: 'EPSG:3857',
        crossOrigin: 'anonymous'
      });

      const optionsArabaGris: any = optionsFromCapabilities(result, {
        layer: 'OGC_ARABA_WMTS_Grisa',
        matrixSet: 'EPSG:3857',
        crossOrigin: 'anonymous'
      });


    let arabaBasico =  new TileLayer({
      visible:true,
      opacity: 1,
      source: new WMTS(optionsArabaBasico),
    })

    arabaBasico.set('name','arabaBasico');
    this.mapService.map.addLayer(arabaBasico);

    let arabaTopografico =  new TileLayer({
      visible:false,
      opacity: 1,
      source: new WMTS(optionsArabaTopografico),
    })

    arabaTopografico.set('name','arabaTopografico');
    this.mapService.map.addLayer(arabaTopografico);

    let arabaGris =  new TileLayer({
      visible:false,
      opacity: 1,
      source: new WMTS(optionsArabaGris),
    })

    arabaGris.set('name','arabaGris');
    this.mapService.map.addLayer(arabaGris);

  })

  const urlOrtofoto = `https://geo.araba.eus/wmts/1.0.0/WMTS_Ortoargazkiak.xml`
    await axios.get(`${urlOrtofoto}?lang=en&service=WMTS&version=1.3.0&request=GetCapabilities`).then((response) => {
      let result = new WMTSCapabilities().read(response.data);
      const optionsArabaOrtofoto2021: any = optionsFromCapabilities(result, {
        layer: 'ortofoto2021',
        matrixSet: 'EPSG:3857',
        crossOrigin: 'anonymous'
      });
      let arabaOrtofoto2021 =  new TileLayer({
        visible:false,
        opacity: 1,
        source: new WMTS(optionsArabaOrtofoto2021),
      })
    
      arabaOrtofoto2021.set('name','arabaOrtofoto2021');
      this.mapService.map.addLayer(arabaOrtofoto2021);

    })

    /*
    let esriPhysical = new TileLayer({
      visible:false,
      source: new XYZ({
      url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
      })
    })
    esriPhysical.set('name','esriPhysical');
    this.mapService.map.addLayer(esriPhysical);


    let esriStreets = new TileLayer({
      visible:false,
      source: new XYZ({
      url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      })
    })
    esriStreets.set('name','esriStreets');
    this.mapService.map.addLayer(esriStreets);

    let esriTopo = new TileLayer({
      visible:false,
      source: new XYZ({
      url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      })
    })
    esriTopo.set('name','esriTopo');
    this.mapService.map.addLayer(esriTopo);

    let esriImagery = new TileLayer({
      visible:false,
      source: new XYZ({
      url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      })
    })
    esriImagery.set('name','esriImagery');
    this.mapService.map.addLayer(esriImagery);
    */

    this.bsSubscription = this.mapService.BaselayerSubject$.subscribe(bs => {
      if(bs) {
        this.bsmSelected = bs;
      }
    })
  }

  baselayerChange(bs: string) {
    this.mapService.map.getAllLayers().forEach(layer => {
      if (layer instanceof TileLayer) {
        if (layer.get('name') === bs || layer.get('name') === 'osm') {
          layer.setVisible(true)
          this.bsmSelected = bs;
        } else {
          layer.setVisible(false)
        }
      } else if (layer instanceof ImageLayer) {

      }
    })
  }

  ngOnDestroy(){
    this.bsSubscription?.unsubscribe();
  }

}
