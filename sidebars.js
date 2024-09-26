module.exports = {
  docs: [
    'home',
    {
      type: 'category',
      label: 'What is Invariant',
      // collapsed: true,
      items: [
        'what_is/the_birth_of_the_idea',
        'what_is/solana',
      ]
    },

    {
      type: 'category',
      label: 'Concentrated Liquidity',
      // collapsed: true,
      items: [
        'what_is/concentrated_liquidity',
        'what_is/price_of_the_token',
        'what_is/single_token_lp',
        'what_is/ticks',
        'what_is/fees',
        'what_is/merge',
        'what_is/glossary'
      ]
    },

    {
      type: 'category',
      label: 'Practical Guides',
      // collapsed: true,
      items: [
        'practical_guides/howtolisttoken',
  
      ]
    },

    {
      type: 'category',
      label: 'Invariant Bonds',
      // collapsed: true,
      items: [
        'invariant_bonds/introduction',
        'invariant_bonds/math',
        'invariant_bonds/bond_example'
      ]
    },

    {
      type: 'category',
      label: 'Invariant Staker',
      // collapsed: true,
      items: ['invariant_staker/introduction', 'invariant_staker/calculation']
    },
    
    {
      type: 'category',
      label: 'Solana',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'For developers',
          link: {
            type: 'doc',
            id: 'solana/introduction'
          },
          items: [
            'solana/introduction',
            'solana/quick_start',
            'solana/pool',
            'solana/minting_position',
            'solana/position_list',
            'solana/swap',
            'solana/withdraw',
            'solana/invariant_errors'
            
          ]
        },  
        
      ]
    },
    {
      type: 'category',
      label: 'Eclipse',
      collapsed: true,
      items: [
        'eclipse/get_started',
        {
          type: 'category',
          label: 'User Guide',
          link: {
            type: 'doc',
            id: 'eclipse/user_guide'
          },
          items: [
            'eclipse/user_guide/interface',
            'eclipse/user_guide/networks',
            'eclipse/user_guide/how_to_connect_your_wallet',
            'eclipse/user_guide/faucet',
            'eclipse/user_guide/how_to_swap',
            {
              type: 'category',
              label: 'How to add liquidity',
              link: {
                type: 'doc',
                id: 'eclipse/user_guide/how_to_add_liquidity'
              },
              items: [
                'eclipse/user_guide/how_to_add_liquidity/uniform_concentration',
                'eclipse/user_guide/how_to_add_liquidity/price_range'
              ]
            },
            'eclipse/user_guide/how_to_claim_fee',
            'eclipse/user_guide/how_to_remove_liquidity',
            'eclipse/user_guide/stats',
            'eclipse/user_guide/troubleshooting',
            'eclipse/user_guide/faq_tutorial'
          ]
        },
        {
          type: 'category',
          label: 'For developers',
          link: {
            type: 'doc',
            id: 'eclipse/get_started'
          },
          items: [
            'eclipse/introduction',
            'eclipse/quick_start',
            'eclipse/pool',
            'eclipse/minting_position',
            'eclipse/position_list',
            'eclipse/swap',
            'eclipse/withdraw',
            'eclipse/invariant_errors'
            
          ]
        },  
      ]
    },
    {
      type: 'category',
      label: 'Aleph Zero',
      collapsed: true,
      items: [
        'aleph_zero/get_started',
        {
          type: 'category',
          label: 'User Guide',
          items: [
            'aleph_zero/user_guide/interface',
            'aleph_zero/user_guide/networks',
            'aleph_zero/user_guide/how_to_connect_your_wallet',
            'aleph_zero/user_guide/faucet',
            'aleph_zero/user_guide/how_to_swap',
            {
              type: 'category',
              label: 'How to add liquidity',
              link: {
                type: 'doc',
                id: 'aleph_zero/user_guide/how_to_add_liquidity'
              },
              items: [
                'aleph_zero/user_guide/how_to_add_liquidity/uniform_concentration',
                'aleph_zero/user_guide/how_to_add_liquidity/price_range'
              ]
            },
            'aleph_zero/user_guide/how_to_claim_fee',
            'aleph_zero/user_guide/how_to_remove_liquidity',
            // 'aleph_zero/user_guide/stats',
            'aleph_zero/user_guide/how_to_list_your_token',
            'aleph_zero/user_guide/troubleshooting',
            'aleph_zero/user_guide/faq_tutorial'
          ]
        },
        {
          type: 'category',
          label: 'For developers',
          link: {
            type: 'doc',
            id: 'aleph_zero/installation'
          },
          items: [
            'aleph_zero/installation',
            'aleph_zero/overview',
            'aleph_zero/sdk',
            'aleph_zero/types',
            'aleph_zero/storage',
            'aleph_zero/collections',
            'aleph_zero/entrypoints',
            'aleph_zero/handling_azero',
            'aleph_zero/invariant_errors',
            'aleph_zero/deployment'
            
          ]
        },  
        
      ]
    },
    // {
    //   type: 'category',
    //   label: 'Casper Network',
    //   collapsed: true,
    //   items: [
    //     'casper/installation',
    //     'casper/overview',
    //     'casper/sdk',
    //     'casper/types',
    //     'casper/storage',
    //     'casper/collections',
    //     'casper/entrypoints',
    //     'casper/handling_cspr',
    //     'casper/invariant_errors',
    //     'casper/deployment'
    //   ]
    // },
    {
      type: 'category',
      label: 'VARA',
      collapsed: true,
      items: [

        'vara/get_started',

        {
          type: 'category',
          label: 'User Guide',
          link: {
            type: 'doc',
            id: 'vara/installation'
          },
          items: [
            'vara/user_guide/interface',
            'vara/user_guide/networks',
            'vara/user_guide/how_to_connect_your_wallet',
            'vara/user_guide/faucet',
            'vara/user_guide/how_to_swap',
            {
              type: 'category',
              label: 'How to add liquidity',
              link: {
                type: 'doc',
                id: 'vara/user_guide/how_to_add_liquidity'
              },
              items: [
                'vara/user_guide/how_to_add_liquidity/uniform_concentration',
                'vara/user_guide/how_to_add_liquidity/price_range'
              ]
            },
            'vara/user_guide/how_to_claim_fee',
            'vara/user_guide/how_to_remove_liquidity',
            // 'aleph_zero/user_guide/stats',
            'vara/user_guide/troubleshooting',
            'vara/user_guide/faq_tutorial'
          ]
        }, 

        {
          type: 'category',
          label: 'For developers',
          link: {
            type: 'doc',
            id: 'vara/installation'
          },
          items: [
            'vara/installation',
            'vara/overview',
            'vara/sdk',
            'vara/types',
            'vara/storage',
            'vara/collections',
            'vara/entrypoints',
            'vara/invariant_errors'
            
          ]
        }, 
      ]
    },
    {
      type: 'category',
      label: 'Alephium',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'For developers',
          link: {
            type: 'doc',
            id: 'alephium/installation'
          },
          items: [
            'alephium/installation',
        'alephium/overview',
        'alephium/sdk',
        'alephium/types',
        'alephium/storage',
        'alephium/collections',
        'alephium/entrypoints',
        'alephium/handling_alph',
        'alephium/invariant_errors'
        // 'alephium/deployment'
            ]
        },  

      ]
    },
    'faq',
    'resources',
    {
      href: 'https://twitter.com/invariant_labs',
      label: 'Twitter',
      type: 'link'
    },
    {
      href: 'https://www.youtube.com/@invariant_labs',
      label: 'Youtube',
      type: 'link'
    },
    {
      href: 'https://discord.gg/w6hTeWTJvG',
      label: 'Discord',
      type: 'link'
    },
    {
      href: 'https://github.com/invariant-labs',
      label: 'GitHub',
      type: 'link'
    }
  ]
}
