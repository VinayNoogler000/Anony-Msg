# Anony Msg [In-Development]



## Overview

My first ever Next.js Full-Stack production-grade app which allows users to send a message (or a feedback) to another user anonymously, i.e without revealing their identity.

Thanks a lot to my mentor [Sir. Hitesh Choudhary](https://github.com/hiteshchoudhary) for teaching the "industry-standard" way of building modern production-grade full-stack applications using Next.js, like **AnonyMsg** that too for *Free* in such an amazing, efficient, fun & super-commendable way.

If you wanna learn not only Next.js in a *sweet and beautiful* way, but also the *industry-standard* way to build production-grade apps using it, then don't forget to check out [His course](https://youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq&si=MDXDrThRp7V2SonC) on His official [Chai aur Code](https://www.youtube.com/@chaiaurcode) YT Channel. Yup, that's exactly from where I've learnt & upskilled myself in Software Development Engineering! 😉😌🫡🌟



## Learnings

Here are my valuable learnings throughout my development journey of **AnonyMsg**:

1. When creating a Mongoose Schema, then first we need to define the structure of each and every document of that collection for which we're defining the schema, and that's done by using `interface` which extends `Document` class of `mongoose`. For eg: `interface Message extends Document`. You can check out file `src/model/User.ts` for bette understanding. Also, it's a convention (good-practice) to use the name of Schema/Model as the interface name, so that it become easily understandable that structure is defined for that specfic collection's documents.
2. In TypeScript, the datatypes we define (either using `type` or `interface`) are in lowercase, like `string`, and `number`, whereas in Mongoose Schema, the types are in capital-case, like `String`, and `Number`.
3. In a traditional Node.js app, the server starts once, so models are created only once. In Next.js, the backend code runs repeatedly due to "hot-reloading" in development or "serverless functions" in production. Because Mongoose saves previously created models in the background, trying to recreate them will cause your app to crash with an error. To prevent this, we check if the model already exists before creating it:: `( mongoose.models.User as mongoose.Model<User> ) || ( mongoose.model<User>("User", UserSchema) )`. For better understanding of code you can check out the actual implementation in the 2nd-last line of `src/model/User.ts`.
4. `Hot-reloading` (happens in development) which is one of the functionalities of Next.js, which means that when the file changed and saved, then Next.js just updates that specific piece of code and the changes are reflected instantly (almost in real-time), instead of restarting the entire server. Whereas, `Serverless Functions`, doesn't mean that there aren't any servers, rather it means we don't need to manage a permanent server that runs 24 hours a day. There is also a special type of serverless functions called `Edge Functions` which uses *Edge Networking* in which our backend code is broken down into small individual functions and copied to hundreds of mini-servers globally, so when a user sends a request on our website, then a mini-server, which is physically closest to the client (*Edge*), instantly wakes-up, runs that specific function (in *Edge Runtime*), respond the client, and then goes back to sleep (for saving resources). In short, "Edge Networking" is the harware cuz it provides the physical network of computers, the "Edge" is the physical location of the mini-server closest to the client, and the "Edge Runtime" is the software running the backend code in that mini-server at that location.