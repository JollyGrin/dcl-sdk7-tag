import {
  AvatarAnchorPointType,
  AvatarAttach,
  engine,
  Entity,
  executeTask,
  InputAction,
  inputSystem,
  Material,
  MeshCollider,
  MeshRenderer,
  pointerEventsSystem,
  PointerEventType,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { getPlayersInScene } from '~system/Players'
import { getUserData } from '~system/UserIdentity'
import { Totem } from '../totem/totem-components'

import { MessageBus } from '@dcl/sdk/message-bus'
import { MB_PICKUP, MB_REMOVE } from '../MessageBus/constants'
import { PickupSphere, PickupSphereType } from './pickup-components'

const sceneMessageBus = new MessageBus()

export const CreatePickup = (): void => {
  executeTask(async () => {
    let connectedPlayers = await getPlayersInScene({})
    console.log({ connectedPlayers })
  })

  sceneMessageBus.on(MB_PICKUP, ({ avatarId }) => {
    executeTask(async () => {
      let { data } = await getUserData({})
      if (!data) return

      const isSelf = avatarId === data?.userId
      console.log(avatarId, data?.userId, isSelf)
      console.log(avatarId, data?.userId, isSelf)
      PickupFactory({ userId: avatarId, displayName: data.displayName }, !isSelf)
    })
  })

  sceneMessageBus.on(MB_REMOVE, ({ userId, displayName }) => {
    for (const [entity] of engine.getEntitiesWith(PickupSphere)) {
      const sphereUserId = PickupSphere.get(entity).userId
      const isSelectedSphere = sphereUserId === userId

      if (isSelectedSphere) {
        console.log(`${displayName} was tagged!`)
        engine.removeEntity(entity)
      }
    }
  })

  engine.addSystem(PickupSystem)
  engine.addSystem(RemoveSphereSystem)
  engine.addSystem(TouchSystem)
}

/* ################## */

const PickupFactory = ({ userId, displayName = 'FooBar' }: PickupSphereType, withCollider = false): Entity => {
  const Parent = engine.addEntity()
  AvatarAttach.createOrReplace(Parent, {
    avatarId: userId,
    anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
  })

  const PickupBall = engine.addEntity()
  PickupSphere.createOrReplace(PickupBall, {
    userId,
    displayName
  })
  MeshRenderer.setSphere(PickupBall)
  withCollider && MeshCollider.setSphere(PickupBall)
  Transform.createOrReplace(PickupBall, {
    parent: Parent,
    position: Vector3.create(0, -1, 0)
  })

  const transparentMaterial = Color4.create(1, 0, 0, 0.1)
  Material.setPbrMaterial(PickupBall, {
    albedoColor: transparentMaterial,
    emissiveColor: transparentMaterial
  })

  return PickupBall
}

const PickupMessageBus = (AvatarId: string) => {
  sceneMessageBus.emit(MB_PICKUP, { avatarId: AvatarId })
}

const isPlayerNearBox = (playerPos: Vector3, boxPos: Vector3, hitRange: number) => {
  // Calculate the difference between the player position and the box position
  const diff = {
    x: Math.abs(playerPos.x - boxPos.x),
    y: Math.abs(playerPos.y - boxPos.y),
    z: Math.abs(playerPos.z - boxPos.z)
  }

  // Check if the difference is less than or equal to the given number in all dimensions
  return diff.x <= hitRange && diff.y <= hitRange && diff.z <= hitRange
}

const PickupSystem = () => {
  if (!Transform.get(engine.PlayerEntity)) return // prevents crash on first render

  const totem = engine.getEntitiesWith(Totem.red)
  for (const [entity] of totem) {
    const boxPosition = Transform.get(entity).position
    const playerPosition = Transform.get(engine.PlayerEntity).position

    const isTouching = isPlayerNearBox(playerPosition, boxPosition, 1)
    if (isTouching) {
      const mutablePlayerEntity = Transform.getMutable(engine.PlayerEntity)
      mutablePlayerEntity.position = Vector3.create(15, 0, 15)
      PickupTheBall()
    }
  }
}

const TouchSystem = () => {
  if (!Transform.get(engine.PlayerEntity)) return // prevents crash on first render

  /*
    Apparently the entity position of the sphere is 0 because it's attached to a parent. And the parent doesn't have a transform position
  */
  const Spheres = engine.getEntitiesWith(PickupSphere)
  for (const [entity] of Spheres) {
    const boxPosition = Transform.get(entity).position
    const playerPosition = Transform.get(engine.PlayerEntity).position

    const isTouching = isPlayerNearBox(playerPosition, boxPosition, 1.5)
    if (isTouching) {
      PickupTheBall()
    }
  }
}

const PickupTheBall = () => {
  executeTask(async () => {
    let { data } = await getUserData({})
    console.log(data)

    if (data?.userId) {
      const { userId, displayName } = data
      PickupFactory({ userId, displayName })
      PickupMessageBus(userId)
    }
  })
}

const RemoveSphereSystem = () => {
  const Spheres = engine.getEntitiesWith(PickupSphere)

  for (const [entity] of Spheres) {
    if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN, entity)) {
      const { userId, displayName } = PickupSphere.get(entity)
      sceneMessageBus.emit(MB_REMOVE, { userId, displayName })
      engine.removeEntity(entity)
    }
  }
}
