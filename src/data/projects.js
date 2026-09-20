/* ==========================================================================
   YOUR PROJECTS — edit this array and the cards build themselves.

   {
     title:       string   required  - shown as the card heading
     description: string   required  - a couple of sentences
     image:       string   optional  - file name inside src/assets/projects/
                                       (a placeholder is drawn if omitted/missing)
     repo:        string   optional  - GitHub URL   (icon hidden when omitted)
     live:        string   optional  - live site URL (icon hidden when omitted)
     tags:        string[] optional  - tech stack chips
     file:        string   optional  - name in the card's title bar
                                       (defaults to the title, e.g. my_app.md)
   }
   ========================================================================== */
export default [
    {
        title: "Project Title One",
        description:
            "Short description of the project. Just a couple sentences will do to explain the tech stack and purpose.",
        repo: "#",
        live: "#",
        tags: ["HTML", "CSS", "JavaScript"],
    },
    {
        title: "Project Title Two",
        description:
            "Short description of the project. Just a couple sentences will do to explain the tech stack and purpose.",
        repo: "#",
        live: "#",
        tags: ["Python", "Flask", "SQL"],
    },
    {
        title: "Project Title Three",
        description:
            "Short description of the project. Just a couple sentences will do to explain the tech stack and purpose.",
        repo: "#",
        live: "#",
        tags: ["React", "Node", "ML"],
    },
];
