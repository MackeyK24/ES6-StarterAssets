# Using Exported Unity Content

![Unity Starter Assets](./Screenshot.png)


## Babylon Toolkit Extension

A universal runtime library for advanced BabylonJS game development.

https://github.com/BabylonJS/BabylonToolkit


## Unity Asset Store

The Starter Assets are free and light-weight first and third person character base controllers for the latest Unity 2023 LTS Or Greater

https://assetstore.unity.com/packages/essentials/starter-assets-character-controllers-urp-267961


## Default Installation
```bash
npm install
npm run dev
```

* Default Toolkit Import Libraries
```javascript
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import { SceneManager } from "@babylonjs-toolkit/next/core/components/scenemanager";
```

* TypeScript Configuration Settings (tsconfig.json)
```json
"types": [
    "@babylonjs/core",
    "@babylonjs/gui",
    "@babylonjs/havok",
    "@babylonjs/loaders",
    "@babylonjs/materials"
]
```
