const modifier = (text) => {

  if (state.shouldStop) {
    state.shouldStop = false;
    stop = true;
  }

  /*********************/
  /* RPGMech by Gnurro */
  /*********************/
  if (state.enableRpg) {
    if (state.RPGstate.XP >= 100) {
      state.RPGstate.XP -= 100
      state.stats.statPoints += 1
      state.skillPoints += 10
      displayStatsUpdate(['Level up', 'Points added!', 'yellow'])
    } else {
      displayStatsUpdate(['Level up', ''])
    }

    if (state.stats.statPoints > 0 || state.skillPoints > 0) {
      displayStatsUpdate(['You have unspent points! Open the menus to the right', '--->', 'red'])
    } else {
      displayStatsUpdate(['You have unspent points! Open the menus to the right'])
    }

    if (miscConfig.showXP) {
      displayStatsUpdate(['XP', state.RPGstate.XP, 'green'])
    }

    if (info.actionCount > 1 && state.inputBot) {
      RPGmechsLog(info?.inputEvaluation)
      let botOutput = info?.inputEvaluation
      RPGmechsLog(`Bot output: ${botOutput}`)

      chkStat = info?.inputEvaluation[statConfig.botOutputs.stat]
      chkDC = info?.inputEvaluation[statConfig.botOutputs.dc]
      chkCuz = info?.inputEvaluation[statConfig.botOutputs.cuz]

      RPGmechsLog(`chkStat: ${chkStat}`)
      RPGmechsLog(`chkDC: ${chkDC}`)
      RPGmechsLog(`chkCuz: ${chkCuz}`)

      if (chkStat == null) {
        chkStat = 'unknown'
      } else if (!typeof (statConfig.statList[chkStat]) === 'undefined') {
        RPGmechsLog(`DCbot got creative and said this is ${chkStat}, but that isn't a configured stat - setting it to 'unknown' for processing.`)
        chkStat = 'unknown'
      }

      if (chkDC == null) {
        chkDC = 0
      }

      delete state.inputBot
      let chkXP = chkDC / 5
      if (state.RPGstate?.showDC) {
        state.message = `${miscConfig.messageStatIcon ? statConfig.statList[chkStat.toLowerCase()].icon : statConfig.statList[chkStat.toLowerCase()].name} DC${chkDC}: ${chkCuz}`
      } else {
        state.message = chkCuz
      }

      checkBit:
      if (chkStat != null) {
        console.log(`Checking whether chkStat is null. It is not. chkStat: ${chkStat}`)
        if (chkStat === 'unknown') {
          console.log(`chkStat equals unknown`)
          RPGmechsLog(`DCbot came up with 'unknown' stat.`)

          chkStatLvl = 0
          if (statConfig?.locking?.lockArbitraryChecks === true) {
            RPGmechsLog(`Stopping check routine due to 'unknown' stat.`)
            break checkBit
          }
        } else {
          console.log(`chkStat does not equal unknown`)
          RPGmechsLog(`${chkStat} found, setting mod to ${state.stats.stats[chkStat].level}.`)
          chkStatLvl = state.stats.stats[chkStat].level
        }

        chkStatPosAdj = statConfig.statList[chkStat.toLowerCase()].successAdjective
        chkStatNegAdj = statConfig.statList[chkStat.toLowerCase()].failAdjective

        if (typeof (state.RPGstate?.chkSkillBonus) !== 'undefined') {
          chkSitBonus = chkStatLvl + state.RPGstate.chkSkillBonus
        } else {
          chkSitBonus = chkStatLvl
        }

        weaponBonusGiven = false;
        equippedWeapon = getEquippedWeapon();
        if (typeof equippedWeapon != 'undefined' && (chkStat == 'Strength')) {
          console.log(`Attack detected. Adding weapon bonus to dice roll. Weapon name -> ${equippedWeapon.name}. Bonus die -> ${equippedWeapon.bonusDamage}`)
          weaponBonusGiven = true;
          chkSitBonus += equippedWeapon.bonusDamage;
        }

        let roll = getRndInteger(statConfig.rolling.checkRollRange[0], statConfig.rolling.checkRollRange[1])
        let chkModRoll = roll + chkSitBonus
        if (chkModRoll >= chkDC) {
          chkMessageResult = miscConfig.successMessage
          if (typeof (state.RPGstate?.chkSitSkill?.results?.positive) !== 'undefined') {
            if (state.RPGstate?.chkSitSkill?.overrideAtt === true) {
              resultContextString = `[${state.RPGstate.chkSitSkill.results.positive}]`
            } else {
              resultContextString = `[You are ${chkStatPosAdj} enough for that right now, and ${state.RPGstate.chkSitSkill.results.positive}.]`
            }
          } else {
            resultContextString = `[You are ${chkStatPosAdj} enough for that right now.]`
          }
          state.RPGstate.XP += chkXP
        } else {
          chkMessageResult = miscConfig.failMessage
          if (typeof (state.RPGstate?.chkSitSkill?.results?.negative) !== 'undefined') {
            if (state.RPGstate?.chkSitSkill?.overrideAtt === true) {
              resultContextString = `[${state.RPGstate.chkSitSkill.results.negative}]`
            } else {
              resultContextString = `[You are too ${chkStatNegAdj} for that right now, and ${state.RPGstate.chkSitSkill.results.negative}.]`
            }
          } else {
            resultContextString = `[You are too ${chkStatNegAdj} for that right now.]`
          }

          if (chkXP > 1) {
            chkXP = Math.floor(chkXP / 2)
          }
          state.RPGstate.XP += chkXP
        }

        displayStatsUpdate(['XP', state.RPGstate.XP, 'green'])
        if (info.actionCount >= 2) {
          state.message += ` ${chkStat} roll: ${chkModRoll} (${roll}${makeModString(chkStatLvl)}${makeModString(state.RPGstate.chkSkillBonus)}${weaponBonusGiven ? makeModString(equippedWeapon.bonusDamage) : ''}), ${chkMessageResult} XP gained: ${chkXP}`
        }

        if (typeof (state.RPGstate?.chkSkillBonus) !== 'undefined') {
          delete state.RPGstate.chkSkillBonus
          delete state.RPGstate.chkSitSkill
        }
      }
    }
  }
  const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ''
  const context = info.memoryLength ? text.slice(info.memoryLength + 1) : text
  const lines = context.split("\n")

  if (typeof (resultContextString) !== 'undefined') {
    lines.splice(-1, 0, resultContextString)
    delete resultContextString
  }

  const combinedLines = lines.join("\n").slice(-(info.maxChars - info.memoryLength))
  var finalText = [contextMemory, combinedLines].join("")
  return { text: finalText }
}

modifier(text);
