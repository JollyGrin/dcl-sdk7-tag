import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { Tag } from './containers/init'
import { CreateTotems } from './containers/tag/totem/totem-init'

// export all the functions required to make the scene work
export * from '@dcl/sdk'

Tag.init()

