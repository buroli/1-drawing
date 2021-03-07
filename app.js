const app = () => {
    // factory function for the initial state
    const initState = () => ({
        maxCell: 100,
        classCell: 'cell',
        defaultCellColor: '#FFFFFF',
        viewportWidth: () => window.innerWidth,
        viewportHeight: () =>  window.innerHeight,
        cellSize: () => state.viewportWidth() / state.maxCell,
        totalCellY: () => Math.floor(state.viewportHeight() / state.cellSize()),
        totalCell: () => state.totalCellY() * state.maxCell,
        elementCell: [],
        isMousedown: false,
        paletteColor: [],
        maxPaletteColor: 20, // max different color
        currentColor: '',
        mouseX: 0,
        mouseY: 0,
        isColorPaletteVisible: false,
    })
    
    let state = initState()

    // some DOM element assignment
    const app = document.getElementById('app');
    const colorPicker = document.querySelector('.color-picker');

    // element to clone
    const createCell = (id) => {
        // each cell is a span element
        const elemCell = document.createElement('span');
        elemCell.classList.add(state?.classCell);
        // add id on each cell, not used for this exercice but can be usefull
        elemCell.setAttribute('id', id);
        // set the size computed before. Need a square cell.
        elemCell.style.width = `${state.cellSize()}px`;
        elemCell.style.height = `${state.cellSize()}px`;
        return elemCell;
    }


    // function to generate grid cell with the values previously computed on the state
    const generateCell = () => {
        for (let index = 0; index < state.totalCell(); index++) {
            state.elementCell.push(createCell(index));
        }
    }

    // as all DOM elements are computed, we can now append them inside its container (#app)
    const insertCell = () => {
        state.elementCell.forEach(cell => {
            app.appendChild(cell.cloneNode(true));
        })
    }

    const rgb2hex = (rgb) => {
        if (  rgb.search("rgb") == -1 ) {
            return rgb;
       } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            function hex(x) {
                 return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]).toUpperCase() + hex(rgb[2]).toUpperCase() + hex(rgb[3].toUpperCase()); 
       }
    }

    // little helper to show/hide cell
    const toggleStatesCell = (elem) => {
        // cell with default color
        if(!elem.target.style.backgroundColor){
            return state.currentColor;
            // cell with same color
        } else if(rgb2hex(elem.target.style.backgroundColor) === state.currentColor) {
            return state.defaultCellColor;
        } else {
            // new cell
            return state.currentColor;
        }
    }

    // bunch of functions to handle event attached 
    const handleMousedown = (cell) => {
        state.isMousedown = true;
        const { style } = cell.target;
        style.backgroundColor = toggleStatesCell(cell);
    }

    const handleMouseover = (cell) => {
        const {clientX, clientY} = cell;
        const { style } = cell.target;
        // add some correction to color palette to avoid that the cursor is out of container when it's open
        const correction = 5;
        state.mouseX = clientX;
        state.mouseY = clientY;
        // set position of color palette
        colorPicker.style.top = `${state.mouseY - correction}px`;
        colorPicker.style.left = `${state.mouseX - correction}px`;
        // hide palette if cursor is outside it
        if(!cell?.relatedTarget?.classList?.contains('color-picker')){
            colorPicker.classList.remove('open');
            state.isColorPaletteVisible = false;
        }
        // enable dragging only when mousedown is true
        if(state.isMousedown){
            style.backgroundColor = toggleStatesCell(cell);
        }
    }

    // helper to generate random colors
    const generateColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const paletteColor = () => {
        for (let index = 0; index < state.maxPaletteColor; index++) {
            state.paletteColor.push(generateColor());
        } 
    }

    const handlePaletteColor = (element, currentIndex) => {
        // reset all active state
        document.querySelectorAll('.color-picker__item').forEach(color => color.classList.remove('active'));
        // save current color onClick
        state.currentColor = state.paletteColor[currentIndex];
        // set active class on current selected color
        if(state.currentColor === state.paletteColor[currentIndex]) element.target.classList.add('active');

        // hide palette color
        colorPicker.classList.remove('open');
    }

    // generate each color inside color-picker container and defining its behaviors
    const colorComponentList = () => {
        for (let index = 0; index < state.paletteColor.length; index++) {
            const colorElement = document.createElement('span');
            colorElement.classList.add('color-picker__item');
            colorElement.style.backgroundColor = state.paletteColor[index];
            colorElement.addEventListener('click', (event) => {
                handlePaletteColor(event, index);
            }, false)
            colorPicker.appendChild(colorElement);
        }
    }

    // handle visibility of color palette
    const showPalette = () => {
        colorPicker.classList.add('open')
        state.isColorPaletteVisible = true
    }

    // function to wrap all mechanism defined previously
    const init = () => {
        // execute some functions to drawing, set state, etc.
        generateCell()
        insertCell()
        paletteColor()
        state.currentColor = state.paletteColor[0]
        colorComponentList()

        // attach event to each cell
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('mousedown', handleMousedown, false)
            cell.addEventListener('mouseover', handleMouseover, false)
        })

        // handle mouseUp event
        document.addEventListener('mouseup', () => {
            state.isMousedown = false
        }, false)

        // handle right click
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            showPalette()
        }, false)

        // for debug purpose
        window.appState = state

    }
    
    // init app
    init();
}

// attach app function on document load.
document.addEventListener('load', app())