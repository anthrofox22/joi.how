import { type FunctionComponent } from 'react'
import '../settings.css'

interface ICumSettingProps {
  enabled: boolean
  ejaculateLikelihood: number
  setEjaculateLikelihood: (newLikelihood: number) => void
  ruinLikelihood: number
  setRuinLikelihood: (newLikelihood: number) => void
}

function parseInteger(value: string): number {
  return parseInt(value) ?? 0
}

export const CumSetting: FunctionComponent<ICumSettingProps> = (props) => {
  return (
    <fieldset className={props.enabled ? 'settings-group' : 'settings-group--disabled'}>
      <legend>Cum</legend>
      <div className="settings-row">
        <strong>Requires that the &quot;cum&quot; event be enabled.</strong>
      </div>
      <div className="settings-row">
        <div className="settings-innerrow">
          {props.ejaculateLikelihood === 100 ? <em>You will ejaculate during this game</em> : null}
          {props.ejaculateLikelihood === 0 ? <em>You won&apos;t ejaculate at all during this game</em> : null}
          {props.ejaculateLikelihood !== 0 && props.ejaculateLikelihood !== 100 ? (
            <em>{props.ejaculateLikelihood}% chance you&apos;ll ejaculate at all during this game</em>
          ) : null}
          <label>
            <span>Ejaculate</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={props.ejaculateLikelihood}
              onChange={(e) => {
                props.setEjaculateLikelihood(parseInteger(e.target.value))
              }}
            />
          </label>
          <span>
            <strong>{props.ejaculateLikelihood}</strong>% of the time
          </span>
        </div>
        <strong>Given an orgasm occurs...</strong>
        <div className="settings-innerrow">
          {props.ruinLikelihood === 0 ? (
            <em>You won&apos;t have a ruined orgasm during this game</em>
          ) : (
            <em>
              {Math.round(props.ejaculateLikelihood * (props.ruinLikelihood / 100))}% chance you&apos;ll have a ruined orgasm during this
              game
            </em>
          )}
          <label>
            <span>Ruin</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={props.ruinLikelihood}
              onChange={(e) => {
                props.setRuinLikelihood(parseInteger(e.target.value))
              }}
            />
          </label>
          <span>
            <strong>{props.ruinLikelihood}</strong>% of ejaculations
          </span>
        </div>
      </div>
    </fieldset>
  )
}
