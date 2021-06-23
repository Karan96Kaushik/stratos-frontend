import React, { Component, useContext } from 'react';

class InstallPanel extends React.Component {

    componentDidMount(){

      // Code to handle install prompt on desktop
      let deferredPrompt;
    //   const addBtn = document.querySelector('.add-button');
    //   addBtn.style.display = 'none';
      console.log('start')

      window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeInstall')
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        // e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        // addBtn.style.display = 'block';

        window.addEventListener('sodapop', (e) => {
            console.log('clickEvent')
            // hide our user interface that shows our A2HS button
            // addBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                  console.log('User accepted the A2HS prompt');
                } else {
                  console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
              });
          });

        // addBtn.addEventListener('click', (e) => {
        //   console.log('clickEvent')
        //   // hide our user interface that shows our A2HS button
        //   addBtn.style.display = 'none';
        //   // Show the prompt
        //   deferredPrompt.prompt();
        //   // Wait for the user to respond to the prompt
        //   deferredPrompt.userChoice.then((choiceResult) => {
        //       if (choiceResult.outcome === 'accepted') {
        //         console.log('User accepted the A2HS prompt');
        //       } else {
        //         console.log('User dismissed the A2HS prompt');
        //       }
        //       deferredPrompt = null;
        //     });
        // });
      });
    }



    render() {

      return(
          <div className="container">

          {/* <button className="add-button">Add to home screen</button> */}
        </div>
      );
    }
  }

  export default InstallPanel;