import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function SkillMatcher({ profiles, onMatchResults }) {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const skills = new Set();
    profiles.forEach((profile) => {
      profile.skills.forEach((skill) => skills.add(skill.toLowerCase()));
    });
    setAvailableSkills(Array.from(skills).sort());
  }, [profiles]);

  const addSkill = (skill) => {
    setSelectedSkills([...selectedSkills, skill]);
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const findMatches = () => {
    const matches = profiles.filter((profile) =>
      selectedSkills.every((skill) => profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase())),
    );
    onMatchResults(matches);
  };

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <h2 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">Skill Matcher</h2>
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <span key={skill} className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
            {skill}
            <button onClick={() => removeSkill(skill)} className="ml-2 text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faTimes} className="text-xs" />
            </button>
          </span>
        ))}
      </div>
      <select
        className="mr-2 rounded border p-2 dark:bg-gray-700 dark:text-white"
        onChange={(e) => addSkill(e.target.value)}
        value=""
      >
        <option value="" disabled>
          Select a skill
        </option>
        {availableSkills
          .filter((skill) => !selectedSkills.includes(skill))
          .map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
      </select>
      <button
        onClick={findMatches}
        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Find Matches
      </button>
    </div>
  );
}

export default SkillMatcher;
