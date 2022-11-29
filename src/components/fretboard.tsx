import * as React from "react"
import styled from "styled-components"

type NoteNumber = number
type Remark = string
type FretNotation =
  | [
      NoteNumber,
      NoteNumber,
      NoteNumber,
      NoteNumber,
      NoteNumber,
      NoteNumber,
      NoteNumber
    ]
type BoardNotation = FretNotation[]

const Board = styled.div`
  display: flex;
  margin: 8px;
`
const Fret = styled.div`
  width: calc(100% / 24);
  display: flex;
  flex-direction: column;
`

const String = styled.div`
  border-left: 1px solid black;
  border-right: 1px solid black;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid black;
  &:first-child {
    border: none;
    border-bottom: 1px solid black;
  }
  & > * {
    transform: translateY(20px);
  }
`

const Note = styled.div<{ isTransparent?: boolean }>`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  background-color: orange;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.isTransparent ? "50%" : "100%")};
`

const Space = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
`

function noteProgression(note: NoteNumber): NoteNumber {
  return (note % 12) + 1
}

function nameTheNote(
  note: NoteNumber,
  isAlphabet = false,
  isSharp = true
): string {
  const numberBaseNotes = [1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7]
  const numberNote = numberBaseNotes[note - 1]
  const baseNote = Math.floor(numberNote + (isSharp ? 0 : 0.5))
  const toneChange = numberNote === baseNote ? "" : isSharp ? "#" : "b"

  const alphabetNotes = ["C", "D", "E", "F", "G", "A", "B"]
  const noteName = isAlphabet ? alphabetNotes[baseNote - 1] : baseNote
  return noteName + toneChange
}

function fretProgression(fret: FretNotation): FretNotation {
  const strings: FretNotation = fret.map(noteProgression) as FretNotation
  return strings
}

type FretboardPropType = { children?: React.ReactNode }
export const Fretboard: React.FunctionComponent<FretboardPropType> = ({
  children,
}) => {
  const board: BoardNotation = []
  let singleFret = [5, 12, 8, 3, 10, 5, 0] as FretNotation

  for (let i = 0; i < 23; i++) {
    board.push(singleFret)
    singleFret = fretProgression(singleFret)
  }

  return (
    <Board>
      {board.map((fretNotation) => {
        const fretNames = fretNotation
          .slice(0, 6)
          .map((note) => nameTheNote(note, false, false))
        const remark = fretNotation[6]
        const fretRemark = nameTheNote(((13 - remark) % 12) + 1, true) // nameTheNote((15 - remark) % 13, true)
        return (
          <Fret>
            {fretNames.map((name) => {
              const isDisplay = ["1"].includes(name)
              return (
                <String>
                  {isDisplay && (
                    <Note isTransparent={!["1", "3", "5"].includes(name)}>
                      {name}
                    </Note>
                  )}
                </String>
              )
            })}
            {fretRemark.length === 1 && <Space>{fretRemark}</Space>}
          </Fret>
        )
      })}
    </Board>
  )
}
