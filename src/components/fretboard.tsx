import * as React from "react"
import styled from "styled-components"

type NoteNumber = number
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

const Fret = styled.div<{ bgColor?: string }>`
  width: calc(100% / 24);
  display: flex;
  flex-direction: column;
  & ${String}:not(:first-child) {
    background-color: ${(props) => props.bgColor};
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
  { isAlphabet = false, isSharp = true, base = "C" }
): string {
  const numberBaseNotes = [1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7]
  const numberNote = numberBaseNotes[note - 1]
  const baseNote = Math.floor(numberNote + (isSharp ? 0 : 0.5))
  const toneChange = numberNote === baseNote ? "" : isSharp ? "#" : "b"

  const alphabetNotes = ["C", "D", "E", "F", "G", "A", "B"]
  const baseIndex = alphabetNotes.indexOf(base)
  const englishName = alphabetNotes
    .slice(baseIndex, 7)
    .concat(alphabetNotes.slice(0, baseIndex))
  const noteName = isAlphabet ? englishName[baseNote - 1] : baseNote
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

  for (let i = 0; i < 16; i++) {
    board.push(singleFret)
    singleFret = fretProgression(singleFret)
  }

  return (
    <Board>
      {board.map((fretNotation, i) => {
        const fretNames = fretNotation
          .slice(0, 6)
          .map((note) => nameTheNote(note, {}))
        const remark = fretNotation[6]
        const fretRemark = nameTheNote(((13 - remark) % 12) + 1, {
          isAlphabet: true,
        })
        const fretColor = undefined
        //  [3, 5, 7, 9].includes(i)
        //   ? "#eeeeee"
        //   : [12].includes(i)
        //   ? "#cceecc"
        //   : [0].includes(i)
        //   ? "grey"
        //   : undefined
        return (
          <Fret bgColor={fretColor}>
            {i}
            {fretNames.map((name) => {
              const isDisplay = ["1", "2", "3", "5", "6"].includes(name)
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
