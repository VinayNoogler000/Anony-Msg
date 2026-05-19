# Anony Msg [In-Development]



## Overview

My first ever Next.js Full-Stack production-grade app which allows users to send a message (or a feedback) to another user anonymously, i.e without revealing their identity.

Thanks a lot to my mentor [Sir. Hitesh Choudhary](https://github.com/hiteshchoudhary) for teaching the "industry-standard" way of building modern production-grade full-stack applications using Next.js, like **AnonyMsg** that too for *Free* in such an amazing, efficient, fun & super-commendable way.

If you wanna learn not only Next.js in a *sweet and beautiful* way, but also the *industry-standard* way to build production-grade apps using it, then don't forget to check out [His course](https://youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&si=MDXDrThRp7V2SonC) on His official [Chai aur Code](https://www.youtube.com/@chaiaurcode) YT Channel. Yup, that's exactly from where I've learnt & upskilled myself in Software Development Engineering! 😉😌🫡🌟



## Learnings

Here are my valuable learnings throughout my development journey of **AnonyMsg**:

1. When creating a Mongoose Schema, then first we need to define the structure of each and every document of that collection for which we're defining the schema, and that's done by using `interface` which extends `Document` class of `mongoose`. For eg: `interface Message extends Document`. You can check out file `src/model/User.ts` for bette understanding. Also, it's a convention (good-practice) to use the name of Schema/Model as the interface name, so that it become easily understandable that structure is defined for that specfic collection's documents.
2. In TypeScript, the datatypes we define (either using `type` or `interface`) are in lowercase, like `string`, and `number`, whereas in Mongoose Schema, the types are in capital-case, like `String`, and `Number`.