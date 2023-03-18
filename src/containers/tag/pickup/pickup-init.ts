import {
  AvatarAnchorPointType,
  AvatarAttach,
  engine,
  Entity,
  executeTask,
  InputAction,
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
import { MB_PICKUP } from '../MessageBus/constants'

const sceneMessageBus = new MessageBus()

export const CreatePickup = (): void => {
  executeTask(async () => {
    let connectedPlayers = await getPlayersInScene({})
    console.log({ connectedPlayers })
  })

  sceneMessageBus.on(MB_PICKUP, ({ avatarId }) => {
    PickupFactory(avatarId, true)
  })

  engine.addSystem(PickupSystem)
}

/* ################## */

const PickupFactory = (AvatarId: string, withCollider = false): Entity => {
  const LeftHandParent = engine.addEntity()
  AvatarAttach.createOrReplace(LeftHandParent, {
    avatarId: AvatarId,
    anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG
  })

  const PickupBall = engine.addEntity()
  MeshRenderer.setSphere(PickupBall)
  withCollider && MeshCollider.setSphere(PickupBall)
  Transform.createOrReplace(PickupBall, {
    parent: LeftHandParent,
    position: Vector3.create(0, -1, 0)
  })

  const transparentMaterial = Color4.create(1, 0, 0, 0.1)
  Material.setPbrMaterial(PickupBall, {
    albedoColor: transparentMaterial,
    emissiveColor: transparentMaterial
  })

  pointerEventsSystem.onPointerDown(
    PickupBall,
    () => {
      console.log('HITTTTTTTTTTTTT')
      engine.removeEntity(PickupBall)
    },
    {
      button: InputAction.IA_PRIMARY,
      hoverText: 'Press E to spawn',
      showFeedback: true,
      maxDistance: 4
    }
  )

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

const PickupTheBall = () => {
  executeTask(async () => {
    let { data } = await getUserData({})
    console.log(data)

    if (data?.userId) {
      PickupFactory(data.userId)
      PickupMessageBus(data.userId)
    }
  })
}
