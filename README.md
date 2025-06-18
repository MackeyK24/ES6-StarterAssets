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
import { Engine, Scene } from '@babylonjs/core';
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";
import TOOLKIT from 'babylon-toolkit-next';
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


## Core Framework Classes (ES6)

```javascript
import { IAction } from "@babylonjs/core/Actions/action";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { ExecuteCodeAction } from "@babylonjs/core/Actions/directActions";
import { Animation } from "@babylonjs/core/Animations/animation";
import { _IAnimationState } from "@babylonjs/core/Animations/animation";
import { IAnimatable } from "@babylonjs/core/Animations";
import { Animatable } from "@babylonjs/core/Animations/animatable";
import { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import { TargetedAnimation } from "@babylonjs/core/Animations/animationGroup";
import { IAnimationKey } from "@babylonjs/core/Animations/animationKey";
import { EasingFunction } from "@babylonjs/core/Animations/easing";
import { AssetContainer } from "@babylonjs/core/assetContainer";
import { InstantiatedEntries } from "@babylonjs/core/assetContainer";
import { Sound } from "@babylonjs/core/Audio/sound";
import { AudioEngineV2, IWebAudioEngineOptions, CreateAudioEngineAsync, AbstractSpatialAudio, StaticSoundBuffer, IStaticSoundBufferOptions, StreamingSound, IStreamingSoundOptions, IStaticSoundOptions, StaticSound } from "@babylonjs/core/AudioV2";
import { Bone } from "@babylonjs/core/Bones/bone";
import { Skeleton } from "@babylonjs/core/Bones/skeleton";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { BoundingBox } from "@babylonjs/core/Culling/boundingBox";
import { BoundingInfo } from "@babylonjs/core/Culling/boundingInfo";
import { Ray } from "@babylonjs/core/Culling/ray";
import { PhysicsViewer } from "@babylonjs/core/Debug/physicsViewer";
import { RayHelper } from "@babylonjs/core/Debug/rayHelper";
import { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { Engine } from "@babylonjs/core/Engines/engine";
import { EngineCapabilities } from "@babylonjs/core/Engines/engineCapabilities";
import { EngineStore } from "@babylonjs/core/Engines/engineStore";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { IPointerEvent } from "@babylonjs/core/Events";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { PointerInfo } from "@babylonjs/core/Events/pointerEvents";
import { Gamepad } from "@babylonjs/core/Gamepads/gamepad";
import { StickValues } from "@babylonjs/core/Gamepads/gamepad";
import { GenericPad } from "@babylonjs/core/Gamepads";
import { DualShockDpad } from "@babylonjs/core/Gamepads/dualShockGamepad";
import { DualShockPad } from "@babylonjs/core/Gamepads/dualShockGamepad";
import { GamepadManager } from "@babylonjs/core/Gamepads/gamepadManager";
import { Xbox360Dpad } from "@babylonjs/core/Gamepads/xboxGamepad";
import { Xbox360Pad } from "@babylonjs/core/Gamepads/xboxGamepad";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Light } from "@babylonjs/core/Lights/light";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { CascadedShadowGenerator } from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator";
import { IShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { IShadowLight } from "@babylonjs/core/Lights/shadowLight";
import { ShadowLight } from "@babylonjs/core/Lights/shadowLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import { DefaultLoadingScreen } from "@babylonjs/core/Loading/loadingScreen";
import { ILoadingScreen } from "@babylonjs/core/Loading/loadingScreen";
import { ISceneLoaderPlugin } from "@babylonjs/core/Loading/sceneLoader";
import { ISceneLoaderPluginAsync } from "@babylonjs/core/Loading/sceneLoader";
import { ISceneLoaderProgressEvent } from "@babylonjs/core/Loading/sceneLoader";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { ShaderLanguage } from "@babylonjs/core/Materials";
import { Effect } from "@babylonjs/core/Materials/effect";
import { Material } from "@babylonjs/core/Materials/material";
import { MaterialDefines } from "@babylonjs/core/Materials/materialDefines";
import { MaterialPluginBase } from "@babylonjs/core/Materials/materialPluginBase";
import { MultiMaterial } from "@babylonjs/core/Materials/multiMaterial";
import { NodeMaterial } from "@babylonjs/core/Materials/Node/nodeMaterial";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { IShaderMaterialOptions } from "@babylonjs/core/Materials/shaderMaterial";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { RenderTargetTexture } from "@babylonjs/core/Materials/Textures/renderTargetTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { VideoTexture } from "@babylonjs/core/Materials/Textures/videoTexture";
import { UniformBuffer } from "@babylonjs/core/Materials/uniformBuffer";
import { Axis } from "@babylonjs/core/Maths/math.axis";
import { Space } from "@babylonjs/core/Maths/math.axis";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Epsilon } from "@babylonjs/core/Maths/math.constants";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { Matrix } from "@babylonjs/core/Maths/math.vector";
import { Quaternion } from "@babylonjs/core/Maths/math.vector";
import { TmpVectors } from "@babylonjs/core/Maths/math.vector";
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Vector4 } from "@babylonjs/core/Maths/math.vector";
import { Viewport } from "@babylonjs/core/Maths/math.viewport";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { InstancedMesh } from "@babylonjs/core/Meshes/instancedMesh";
import { LinesMesh } from "@babylonjs/core/Meshes/linesMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { SubMesh } from "@babylonjs/core/Meshes/subMesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { AbstractAssetTask } from "@babylonjs/core/Misc/assetsManager";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { BinaryFileAssetTask } from "@babylonjs/core/Misc/assetsManager";
import { ContainerAssetTask } from "@babylonjs/core/Misc/assetsManager";
import { ImageAssetTask } from "@babylonjs/core/Misc/assetsManager";
import { MeshAssetTask } from "@babylonjs/core/Misc/assetsManager";
import { TextFileAssetTask } from "@babylonjs/core/Misc/assetsManager";
import { DeepCopier } from "@babylonjs/core/Misc/deepCopier";
import { EnvironmentTextureTools } from "@babylonjs/core/Misc/environmentTextureTools";
import { IFileRequest } from "@babylonjs/core/Misc/fileRequest";
import { Logger } from "@babylonjs/core/Misc/logger";
import { EventState } from "@babylonjs/core/Misc/observable";
import { Observable } from "@babylonjs/core/Misc/observable";
import { Observer } from "@babylonjs/core/Misc/observable";
import { Tags } from "@babylonjs/core/Misc/tags";
import { Tools } from "@babylonjs/core/Misc/tools";
import { RegisterClass } from "@babylonjs/core/Misc/typeStore";
import { WebRequest } from "@babylonjs/core/Misc/webRequest";
import { MorphTarget } from "@babylonjs/core/Morph/morphTarget";
import { ICrowd, INavMeshParameters, IObstacle, INavigationEnginePlugin, IAgentParameters } from "@babylonjs/core/Navigation";
import { Node } from "@babylonjs/core/node";
import { IParticleSystem } from "@babylonjs/core/Particles/IParticleSystem";
import { PhysicsBody, PhysicsShape, PhysicsShapeType, PhysicsShapeSphere, PhysicsShapeCapsule, PhysicsShapeCylinder, PhysicsShapeBox, PhysicsShapeContainer, PhysicsShapeMesh, PhysicsShapeConvexHull, PhysicsRaycastResult, ShapeCastResult, PhysicsMassProperties, PhysicsMotionType, PhysicsMaterialCombineMode, IRaycastQuery, IPhysicsCollisionEvent, IBasePhysicsCollisionEvent, IPhysicsEnabledObject } from "@babylonjs/core/Physics";
import { PhysicsEngine } from "@babylonjs/core/Physics/v1/physicsEngine";
import { PhysicsImpostor } from "@babylonjs/core/Physics/v1/physicsImpostor";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { RenderingManager } from "@babylonjs/core/Rendering/renderingManager";
import { Scene } from "@babylonjs/core/scene";
import { DeepImmutable } from "@babylonjs/core/types";
import { FloatArray } from "@babylonjs/core/types";
import { Nullable } from "@babylonjs/core/types";
import HavokPhysics from "@babylonjs/havok";
import { ArrayItem, IGLTFLoaderExtension, IScene, INode, IMaterial, IAnimation, IMesh, IMeshPrimitive, registerGLTFExtension } from "@babylonjs/loaders/glTF/2.0";
import { GLTFLoader } from "@babylonjs/loaders/glTF/2.0/glTFLoader";
import { GLTFFileLoader } from "@babylonjs/loaders/glTF/glTFFileLoader";
```