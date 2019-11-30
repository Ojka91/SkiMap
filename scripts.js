var app = new Vue({
    el: '#app',
    data: {
    
    },
  
    methods: {
        login: function () {
            // https://firebase.google.com/docs/auth/web/google-signin

            // Provider
            var provider = new firebase.auth.GoogleAuthProvider();
           
            firebase.auth().signInWithPopup(provider).then(function (result) {
               console.log(result);
               console.log("Succeful")
            }).catch(function(err){
                console.log(err);
                console.log("Error");
            });
        },

        writeNewPost: function () {

            // https://firebase.google.com/docs/database/web/read-and-write

            // Values
            var message = {
                message: "location...",
                name: firebase.auth().currentUser.displayName,
            }

            firebase.database().ref('location').push(message)

     
    },
    mounted: function() {
  
    
    }
  
    
  
  })