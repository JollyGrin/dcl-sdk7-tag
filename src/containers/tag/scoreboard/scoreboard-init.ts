import { engine, Entity, MeshRenderer, TextShape, Transform } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"

export const CreateScoreboard = () => {
    const wall = ScoreboardWall()
    const redText = TeamText(wall, 'red')
}

const ScoreboardWall = (): Entity => {
    const scoreboard = engine.addEntity()
    MeshRenderer.setPlane(scoreboard)
    Transform.create(scoreboard, {
        position: Vector3.create(18, 2, 18),
        rotation: Quaternion.fromEulerDegrees(0, 90, 0),
        scale: Vector3.create(6, 3, 1)
    })
    return scoreboard
}

const TeamText = (parent: Entity, team: 'red' | 'blue') => {
    const text = engine.addEntity()
    TextShape.create(text, {
        text: team
    })
    Transform.create(text, {
        parent: parent,
        scale: Vector3.create(1, 1, 1)
    } )
}