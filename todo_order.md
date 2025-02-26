
# To Do

add more majors (not urgent)  
1. "delete course" icon in each box
2. "undo" and "redo" buttons above map?
3. remove "total completed credits" or fix it and rename to "total credits" or similar
4. remove indication of completed courses (remove checkbox)
    * box green if all prerequisites on map BEFORE course and yellow otherwise
    * transfer credits automatically green
    * course can be green even if its prereq is yellow
5. remove color key
    * "All requirements met" tooltip for green boxes
    * "Unmet requirements (click More information> )" tooltip for yellow boxes
6. consolidate majors jsons into one json array?
7. give "options" and major-specific "electives" a drop-down selector inside box
8. replace "degree selector" with "add requirement" (or "add goal" or similar) for majors/minors
    * small scrollable table above map displays all added requirements and if they are met
        * click a requirement to see why unmet (lack: gen ed, major-specific course, 120 hours, etc.)
        * add "autocomplete" button on each requirement to replace "degree selector" functionality
            * ensure "autocomplete" doesn't put a course before its prereq?
    * create new json array holding majors requirements separate from existing majors json used for autofill
    * deduplicate gen ed from all majors requirements by making a separate entry for it?
    * remove non-major-specific "electives" from autocomplete json?
9. corequisites
10. enable add (and remove?) semesters
11. enable export and import of plan as json
12. alternative ways to get credit (e.g., MATH2610 for CSC2700, MATH4470 for MATH3470)
13. enable select when each semester is (fall 25, spring 26, summer 26, etc.), turn course yellow if not offered then


FOR VINCENT: Add transfer credit feature in class selector
Make saving your degree map