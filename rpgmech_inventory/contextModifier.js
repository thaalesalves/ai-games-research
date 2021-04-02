const modifier = (text) => {

  if (state.shouldStop) {
    state.shouldStop = false;
    stop = true;
  }

  if (state.XP >= 100) {
    state.XP -= 100;
    state.stats["statPoints"] += 1;
    state.skillPoints += 10;
    state.displayStats.push({ key: '\nLevel up', value: 'Points added!', color: 'yellow' });
  }

  if (state.stats["statPoints"] > 0 || state.skillPoints > 0) {
    state.displayStats = [{ key: 'You have unspent points! Open the menus to the right', value: '--->', color: 'red' }];
    state.displayStats.push({ key: '\nXP', value: state.XP, color: 'green' });
  } else {
    state.displayStats = [{ key: 'XP', value: state.XP, color: 'green' }];
  }

  intMod = state.stats["stats"]["Intelligence"]["level"]
  chaMod = state.stats["stats"]["Charisma"]["level"]
  wisMod = state.stats["stats"]["Wisdom"]["level"]
  strMod = state.stats["stats"]["Strength"]["level"]
  dexMod = state.stats["stats"]["Dexterity"]["level"]
  conMod = state.stats["stats"]["Constitution"]["level"]
  // strMod = state.stats["stats"]["Strength"]["level"];
  // aglMod = state.stats["stats"]["Agility"]["level"];
  // conMod = state.stats["stats"]["Constitution"]["level"];
  // intMod = state.stats["stats"]["Intelligence"]["level"];
  // wisMod = state.stats["stats"]["Wisdom"]["level"];
  // perMod = state.stats["stats"]["Personality"]["level"];
  // wprMod = state.stats["stats"]["Willpower"]["level"];

  if (info.actionCount > 1 && state.inputBot) {
    console.log(info?.inputEvaluation);

    chkAtt = info?.inputEvaluation["Attribute"];
    chkDC = info?.inputEvaluation["DC"];
    chkCuz = info?.inputEvaluation["reason"];

    console.log(`CHKATT VALUE IS: ${chkAtt}`);

    delete state.inputBot;

    chkXP = chkDC / 5;

    if (state.showDC) {
      state.message = RpgMechanics.statList()[chkAtt.toLowerCase()].icon + " DC " + chkDC + ": " + chkCuz;
    } else {
      state.message = chkCuz;
    }

    if (chkAtt != null) {
      if (chkAtt.includes("Any")) { // bot sometimes gives that one; just take it as 'too generic'
        chkCurAtt = 0 // so it gets no attribute bonus
        chkAttPosAdj = "good" // this is the crucial bit for generation, but since the bot said it's generic...
        chkAttNegAdj = "bad" // ...AI is told generic things below
      }
      if (chkAtt.includes("Intelligence")) { // when the bot comes up with an attribute...
        chkCurAtt = intMod // ...assign the appropriate attribute modifier...
        chkAttPosAdj = "smart" // ...and use a fitting positive word...
        chkAttNegAdj = "dumb" // ...or negative word to let the AI know for generation below
      }
      // same as above, for all attributes:
      if (chkAtt.includes("Wisdom")) {
        chkCurAtt = wisMod
        chkAttPosAdj = "wise"
        chkAttNegAdj = "oblivious"
      }
      if (chkAtt.includes("Charisma")) {
        chkCurAtt = chaMod
        chkAttPosAdj = "charming"
        chkAttNegAdj = "annoying"
      }
      if (chkAtt.includes("Strength")) {
        chkCurAtt = strMod
        chkAttPosAdj = "strong"
        chkAttNegAdj = "weak"
      }
      if (chkAtt.includes("Dexterity")) {
        chkCurAtt = dexMod
        chkAttPosAdj = "nimble"
        chkAttNegAdj = "clumsy"
      }
      if (chkAtt.includes("Constitution")) {
        chkCurAtt = conMod
        chkAttPosAdj = "tough"
        chkAttNegAdj = "scrawny"
      }
      // if (chkAtt.includes("Any")) {
      //   chkCurAtt = 0;
      //   chkAttPosAdj = "good";
      //   chkAttNegAdj = "bad";
      // } else if (chkAtt.includes("Strength")) {
      //   chkCurAtt = strMod;
      //   chkAttPosAdj = "strong";
      //   chkAttNegAdj = "weak";
      // } else if (chkAtt.includes("Agility")) {
      //   chkCurAtt = aglMod;
      //   chkAttPosAdj = "agile";
      //   chkAttNegAdj = "stiff";
      // } else if (chkAtt.includes("Constitution")) {
      //   chkCurAtt = conMod;
      //   chkAttPosAdj = "nimble";
      //   chkAttNegAdj = "clumsy";
      // } else if (chkAtt.includes("Intelligence")) {
      //   chkCurAtt = intMod;
      //   chkAttPosAdj = "smart";
      //   chkAttNegAdj = "dumb";
      // } else if (chkAtt.includes("Wisdom")) {
      //   chkCurAtt = wisMod;
      //   chkAttPosAdj = "wise";
      //   chkAttNegAdj = "oblivious";
      // } else if (chkAtt.includes("Personality")) {
      //   chkCurAtt = perMod;
      //   chkAttPosAdj = "agile";
      //   chkAttNegAdj = "stiff";
      // } else if (chkAtt.includes("Willpower")) {
      //   chkCurAtt = wpr;
      //   chkAttPosAdj = "agile";
      //   chkAttNegAdj = "stiff";
      // }

      if (typeof (state.chkSitBonus) !== 'undefined') {
        chkCurSit = chkCurAtt + state.chkSitBonus;
        for (let skillDef in RpgMechanics.skillList()) {
          if (skillDef === state.chkSitSkill) {
            console.log("found skillDef for current skill:" + skillDef)
            if (RpgMechanics.skillList()[skillDef].overrideAtt === true) {
              overrideAtt = true;
              chkSkillPosStr = RpgMechanics.skillList()[skillDef].results['positive'];
              chkSkillNegStr = RpgMechanics.skillList()[skillDef].results['negative'];
            }
            if (RpgMechanics.skillList()[skillDef].overrideAtt === false) {
              overrideAtt = false;
              chkSkillPosStr = RpgMechanics.skillList()[skillDef].results['positive'];
              chkSkillNegStr = RpgMechanics.skillList()[skillDef].results['negative'];
            }
          }
        }

      } else {
        chkCurSit = chkCurAtt;
      }

      for (feat of state.charFeats) {
        console.log(feat);
      }

      roll = RpgMechanics.getRndInteger(1, 20);
      chkModRoll = roll + chkCurSit
      if (chkModRoll >= chkDC) {
        chkResult = "Success!";
        if (typeof (chkSkillPosStr) !== 'undefined') {
          if (overrideAtt == true) {
            resultContextString = `[${chkSkillPosStr}]`;
          }
          if (overrideAtt == false) {
            resultContextString = `[You are ${chkAttPosAdj} enough for that right now, and ${chkSkillPosStr}.]`;
          }
        } else {
          resultContextString = `[You are ${chkAttPosAdj} enough for that right now.]`;
        }
        state.XP += chkXP;
      } else {
        chkResult = "Fail!";
        if (typeof (chkSkillNegStr) !== 'undefined') {
          if (overrideAtt == true) {
            resultContextString = `[${chkSkillNegStr}]`;
          }
          if (overrideAtt == false) {
            resultContextString = `[You are too ${chkAttNegAdj} for that right now, and ${chkSkillNegStr}.]`;
          }
        } else {
          resultContextString = `[You are too ${chkAttNegAdj} for that right now.]`;
        }
        if (chkXP > 1) {
          chkXP = Math.floor(chkXP / 2);
        }
        state.XP += chkXP;
      }

      state.displayStats = [{ key: 'XP', value: state.XP, color: 'green' }];

      if (info.actionCount >= 2) {
        state.message += ` ${chkAtt} roll: ${chkModRoll} (${roll}${RpgMechanics.makeModString(chkCurAtt)}${RpgMechanics.makeModString(state.chkSitBonus)}), ${chkResult} XP gained: ${chkXP}`;
      }

      if (typeof (state.chkSitBonus) !== 'undefined') {
        delete state.chkSitBonus;
        delete state.chkSitSkill;
      }
    }

    for (feat of state.charFeats) {
      console.log(feat);
    }
  }

  const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : '';
  const context = info.memoryLength ? text.slice(info.memoryLength + 1) : text;
  const lines = context.split("\n");

  if (typeof (resultContextString) !== 'undefined') {
    lines.splice(-1, 0, resultContextString);
    delete resultContextString;
  }

  const combinedLines = lines.join("\n").slice(-(info.maxChars - info.memoryLength));
  var finalText = [contextMemory, combinedLines].join("");
  return { text: finalText };
}

modifier(text);
